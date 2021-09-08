import { inspect } from "util";
import { format } from "prettier";
import { CONVERT_TYPES, DEFAULT_PRETTIER_CONFIG } from "./util";

export const transformJSToJSON = (data: string) => {
    // panic on empty data
    if (typeof data === "undefined" || data === "") throw new TypeError("Expected data to convert to JSON.");
    // if data doesn't have an export, it's most likely wrong.
    if (!["export", "module.exports", "exports"].some((x) => data.includes(x))) throw new ParseError("No exporting declaration found!");
    const openingBracket = data.indexOf("{");
    const closingBrack = data.lastIndexOf("}");
    // if there aren't matching opening and closing brackets, assume there's an issue with the data.
    if (openingBracket === -1 || closingBrack === -1) throw new ParseError("Malformed JS data");
    // regex taken from https://stackoverflow.com/a/29269996
    // To ensure JSON validity of the data, we JSON parse after replacing all single quotes with double quotes
    const dataToConvert = JSON.parse(
        data
            .substring(openingBracket - 1, closingBrack + 1)
            .trim()
            .replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":')
            .replace("'", '"'),
    );
    // return converted JSON data as a string, with 4 space formatting.
    return JSON.stringify(dataToConvert, null, 4);
};

export const transformJSONToJS = (data: string, es6?: boolean) => {
    // panic on empty data
    if (typeof data === "undefined" || data === "") throw new TypeError("Expected data to convert to JS.");
    // JSON files can be safely assumed to start and end with curly brackets. If not, then panic.
    if (!data.startsWith("{") || !data.endsWith("}")) throw new ParseError("Malformed JSON data");
    // Get a stringified representation of the parsed JS object data.
    const parsedData = inspect(JSON.parse(data));
    // if es6 flag passed in, use export syntax, otherwise CommonJS syntax.
    return format(es6 ? `export default ${parsedData}` : `module.exports = ${parsedData}`, { parser: "babel", ...DEFAULT_PRETTIER_CONFIG });
};

export const run = (content: string, to: "js" | "json", options?: Partial<ConvertOptions>) =>
    to === CONVERT_TYPES.toJS ? transformJSONToJS(content.trim(), options?.es6) : transformJSToJSON(content.trim());

export class ParseError extends Error {}

export interface ConvertOptions {
    es6: boolean;
}
