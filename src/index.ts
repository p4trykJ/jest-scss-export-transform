var sass = require('node-sass');
var pathToFileURL = require('url').pathToFileURL;
var scssToJson = function (text) {
    return '{'.concat(
        text
            .replace(/:export /g, '')
            .replace(/({|})/g, '')
            .replace(/(\S.*):/g, '"$1":')
            .replace(/: (.*);/g, ': "$1",'),
        '}'
    );
};
var extractExports = function (text: string) {
    if (!text) return;
    return (text.match(/:export([^}]+)}/g) || []).join('\n');
};
module.exports = {
    process: function (sourceText, sourcePath, options) {
        console.log(options.transformerConfig);
        var result = sass.renderSync({
            file: sourcePath,
            importer: [
                function (url) {
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
        var response = result.css.toString()
            ? scssToJson(extractExports(result.css.toString()))
            : JSON.stringify('');
        return {
            code: 'module.exports = '.concat(response),
        };
    },
};
