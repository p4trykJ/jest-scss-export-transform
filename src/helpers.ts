import { Alias } from './types';

const scssToJson = (text: string): string => {
    return '{'.concat(
        text
            .replace(/:export /g, '')
            .replace(/({|})/g, '')
            .replace(/(\S.*):/g, '"$1":')
            .replace(/: (.*);/g, ': "$1",'),
        '}'
    );
};

const extractExports = (text: string): string => {
    if (!text) return;
    return (text.match(/:export {[^}]+}/g) || []).join('\n');
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

export { scssToJson, extractExports, getResolvedAliasedPath };
