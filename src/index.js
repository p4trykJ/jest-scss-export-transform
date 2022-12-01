const sass = require('node-sass');
const { pathToFileURL } = require('url');

const scssToJson = (text) => {
    return `{${text
        .replace(/:export /g, '')
        .replace(/({|})/g, '')
        .replace(/(\S.*):/g, '"$1":')
        .replace(/: (.*);/g, ': "$1",')}}`;
};

const extractExports = (text) => {
    if (!text) return;
    return (text.match(/:export([^}]+)}/g) || []).join('\n');
};

module.exports = {
    process(sourceText, sourcePath, options) {
        console.log(options.transformerConfig);
        const result = sass.renderSync({
            file: sourcePath,
            importer: [
                (url) => {
                    if (!url.startsWith('@style')) return null;
                    return {
                        file: new URL(
                            url.replace('@', ''),
                            pathToFileURL('assets/style')
                        ).pathname,
                    };
                },
            ],
        });
        const response = result.css.toString()
            ? scssToJson(extractExports(result.css.toString()))
            : JSON.stringify('');
        return {
            code: `module.exports = ${response}`,
        };
    },
};
