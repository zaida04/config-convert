import { ParseError, transformJSONToJS, transformJSToJSON} from "../";

const dummyData = {
    js: {
        es6: "export default { test: \"hi!\" };\n",
        commonJS: "module.exports = { test: \"hi!\" };\n"
    },
    json: "{\"test\":\"hi!\"}",
    messedUpData: {
        js: ["const a = { test: \"hi!\" }", "export const a = { test: \"hi!\" ", "export const a = test: \"hi!\" }"],
        json: ["\"test\":\"hi!\"}", "{\"test\":\"hi!\""]
    },
}  as const;

const errorMessages = {
    emptyTransformJS: "Expected data to convert to JSON.",
    emptyTransformJSON: "Expected data to convert to JS.",
    malformedJSData: "Malformed JS data",
    malformedJSONData: "Malformed JSON data",
    noExport: "No exporting declaration found!"
} as const;

describe("Transforming JS data to JSON", () => {
    test("Error on empty data", () => {
        expect(() => transformJSToJSON(undefined)).toThrowError(new TypeError(errorMessages.emptyTransformJS));
        expect(() => transformJSToJSON("")).toThrowError(new TypeError(errorMessages.emptyTransformJS))
    });
    test("Error on no export in data", () => {
        expect(() => transformJSToJSON(dummyData.messedUpData.js[0])).toThrowError(new ParseError(errorMessages.noExport));
    });
    test("Error on missing brackets", () => {
        expect(() => transformJSToJSON(dummyData.messedUpData.js[1])).toThrowError(new ParseError(errorMessages.malformedJSData));
        expect(() => transformJSToJSON(dummyData.messedUpData.js[2])).toThrowError(new ParseError(errorMessages.malformedJSData));
    });
    test("Successful JSON data returned", () => {
        expect(transformJSToJSON(dummyData.js.es6)).toBe(dummyData.json)
        expect(transformJSToJSON(dummyData.js.commonJS)).toBe(dummyData.json)
    });
});

describe("Transforming JSON data to JS", () => {
    test("Error on empty data", () => {
        expect(() => transformJSONToJS(undefined)).toThrowError(new TypeError(errorMessages.emptyTransformJSON));
        expect(() => transformJSONToJS("")).toThrowError(new TypeError(errorMessages.emptyTransformJSON));
    });
    test("Error on missing brackets", () => {
        expect(() => transformJSONToJS(dummyData.messedUpData.json[0])).toThrowError(new ParseError(errorMessages.malformedJSONData));
        expect(() => transformJSONToJS(dummyData.messedUpData.json[1])).toThrowError(new ParseError(errorMessages.malformedJSONData));
    });
    test("Successful JS data returned", () => {
        expect(transformJSONToJS(dummyData.json)).toBe(dummyData.js.commonJS);
        expect(transformJSONToJS(dummyData.json, true)).toBe(dummyData.js.es6);
    });
});