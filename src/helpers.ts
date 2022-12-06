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
    return (text.match(/:export([^}]+)}/g) || []).join('\n');
};

export { scssToJson, extractExports };
