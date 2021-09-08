import { inspect } from "node:util";
import { format } from "prettier";
import { CONVERT_TYPES, DEFAULT_PRETTIER_CONFIG } from "./util";

export const transformJSToJSON = (data: string) => {
    if (typeof data === "undefined" || data === "") throw new TypeError("Expected data to convert to JSON.");
    if (!["export", "module.exports", "exports"].some((x) => data.includes(x))) throw new ParseError("No exporting declaration found!");
    const openingBracket = data.indexOf("{");
    const closingBrack = data.lastIndexOf("}");
    if (openingBracket === -1 || closingBrack === -1) throw new ParseError("Malformed JS data");
    // regex taken from https://stackoverflow.com/a/29269996
    const dataToConvert = JSON.parse(
        data
            .substring(openingBracket - 1, closingBrack + 1)
            .trim()
            .replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":')
            .replace("'", '"'),
    );
    return JSON.stringify(dataToConvert, null, 4);
};

export const transformJSONToJS = (data: string, es6?: boolean) => {
    if (typeof data === "undefined" || data === "") throw new TypeError("Expected data to convert to JS.");
    if (!data.startsWith("{") || !data.endsWith("}")) throw new ParseError("Malformed JSON data");
    const parsedData = inspect(JSON.parse(data));
    return format(es6 ? `export default ${parsedData}` : `module.exports = ${parsedData}`, { parser: "babel", ...DEFAULT_PRETTIER_CONFIG });
};

export const run = (content: string, to: "js" | "json", options?: Partial<ConvertOptions>) =>
    to === CONVERT_TYPES.toJS ? transformJSONToJS(content, options?.es6) : transformJSToJSON(content);

export class ParseError extends Error {}

export interface ConvertOptions {
    es6: boolean;
}
