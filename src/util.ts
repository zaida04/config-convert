/* istanbul ignore file */

export enum CONVERT_TYPES {
    toJS = "js",
    toJSON = "json",
}

export const betterLowerCase = <T extends string>(input: T) => input.toLowerCase() as Lowercase<T>;

export const DEFAULT_PRETTIER_CONFIG = {
    endOfLine: "auto",
    printWidth: 150,
    semi: true,
    tabWidth: 4,
    trailingComma: "all",
} as const;

export const logger = (str: string, color: COLORS = COLORS.RESET) => console.log(color, str, COLORS.RESET);
export enum COLORS {
    RESET = "\x1b[0m",
    RED = "\x1b[31m",
    GREEN = "\x1b[32m",
    YELLOW = "\x1b[33m",
    BGRED = "\x1b[41m",
    BGGREEN = "\x1b[42m",
    BGYELLOW = "\x1b[43m",
}
