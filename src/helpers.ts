import { Alias } from './types';

const QUOTE_SIGN = "'";

const prepareOutput = (text: string): string => {
    if (!text) return JSON.stringify('');
    const onlyExports = extractExports(text);
    if (!onlyExports) return JSON.stringify('');
    const clearedText = clearText(onlyExports);
    const lines = splitLines(clearedText);
    const preparedLines = prepareLines(lines);
    return constructJson(preparedLines);
};

const extractExports = (text: string): string => {
    if (!text) return;
    return (text.match(/:export {[^}]+}/g) || []).join('\n');
};

const clearText = (text: string): string => {
    return text
        .replace(/:export/g, '')
        .replace(/({|})/g, '')
        .replace(/\s*/g, '');
};

const splitLines = (text: string): string[] => {
    return text.split(';').filter((line) => line);
};

const prepareLines = (lines: string[]): string[] => {
    return lines.map((line, index) => {
        const [name, value] = line.split(':');
        return `${QUOTE_SIGN}${name}${QUOTE_SIGN}:${QUOTE_SIGN}${value}${QUOTE_SIGN}${getComma(
            index,
            lines.length
        )}`;
    });
};

const getComma = (index: number, arrayLength: number): string => {
    return index === arrayLength - 1 ? '' : ',';
};

const constructJson = (lines: string[]) => {
    return `{${lines.join('')}}`;
};

const getResolvedAliasedPath = (
    path: string,
    aliases: Alias
): string | null => {
    const objectKeys = Object.keys(aliases);
    for (let index = 0; index < objectKeys.length; index++) {
        const alias = objectKeys[index];
        if (new RegExp(`^${alias}`).test(path)) {
            return path.replace(alias, aliases[alias]);
        }
    }
    return null;
};

const LCERROR = '\x1b[31m%s\x1b[0m'; //red
const logger = {
    error(message, ...optionalParams) {
        console.error(LCERROR, message, ...optionalParams);
    },
};

const handleError = (message) => {
    if (/Can't find stylesheet to import/.test(message)) {
        logger.error(
            'Could not find the file. Check if alias property is configured properly: https://github.com/p4trykJ/jest-scss-export-transform?tab=readme-ov-file#add-to-your-jest-config'
        );
    }
};

export { extractExports, getResolvedAliasedPath, handleError, prepareOutput };
