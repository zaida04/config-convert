#!/usr/bin/env node

import yargs from "yargs";
import { run } from "./index";
import { resolve, parse } from "path";
import { readFile, writeFile } from "fs/promises";
import { betterLowerCase, logger, COLORS } from "./util";

const parser = yargs(process.argv.slice(2))
    .usage("$0 -f <input_file> -t <to-format>")
    .options({
        file: { type: "string", describe: "Path to the file to convert.", alias: ["f"], demandOption: true },
        to: { choices: ["js", "json"] as const, describe: "What format to convert to", alias: ["t"] },
        output: { type: "string", describe: "The name of the output file.", alias: ["o"] },
        es6: { type: "boolean", describe: "For converting to JS, whether to use es6 exports." },
        baseDir: { type: "string", describe: "Set the base dir of where to start a path.", alias: ["b"] },
    });

void (async () => {
    const argv = await parser.argv;
    const BASE_DIR = argv.baseDir ?? process.cwd();
    const inputPath = resolve(BASE_DIR, argv.file);
    const toFormat = (argv.to && betterLowerCase(argv.to)) ?? [".js", ".cjs", ".mjs"].some((x) => inputPath.endsWith(x)) ? "json" : "js";
    console.log(toFormat);

    logger("Reading input file...");
    const file = await readFile(inputPath, "utf-8");
    logger("Running converter...");

    let convertedFile;
    try {
        convertedFile = run(file.trim(), toFormat, { es6: argv.es6 }).replaceAll("\\n", "\n");
    } catch (e) {
        logger(`Conversion failed! Make sure your file is formatted correctly! ${e}`, COLORS.RED);
        return;
    }
    logger("Converting succeeded!", COLORS.GREEN);

    let outputPath = argv.output;
    if (!outputPath) {
        const temp = parse(inputPath);
        outputPath = resolve(temp.dir, `${temp.name}.${toFormat}`);
    }

    logger("Writing to output file...");
    try {
        await writeFile(outputPath, convertedFile, { encoding: "utf-8", flag: "w" });
        logger("Successfully wrote to file...", COLORS.GREEN);
    } catch (e) {
        logger(`Writing to file failed! ${e}`, COLORS.RED);
        return;
    }
    logger("Exiting...");
})();
