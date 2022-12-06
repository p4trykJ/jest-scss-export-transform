import { Alias } from './types';

const QUOTE_SIGN = "'";

const prepareOutput = (text: string): string => {
    if (!text) return JSON.stringify('');
    const onlyExports = extractExports(text);
    console.log('onlyExports', onlyExports);
    if (!onlyExports) return JSON.stringify('');
    const clearedText = clearText(onlyExports);
    const lines = splitLines(clearedText);
    const preparedLines = prepareLines(lines);
    return constructJson(preparedLines);
};

const extractExports = (text: string): string => {
    console.log('text', text);
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

export { prepareOutput, getResolvedAliasedPath };
