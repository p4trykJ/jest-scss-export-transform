import sass from 'node-sass';
import { pathToFileURL } from 'url';
import { extractExports, scssToJson } from './helpers';

module.exports = {
    process: function (sourceText, sourcePath, options) {
        console.log(options.transformerConfig, 'di');
        const result = sass.renderSync({
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
        const response = result.css.toString()
            ? scssToJson(extractExports(result.css.toString()))
            : JSON.stringify('');
        return {
            code: 'module.exports = '.concat(response),
        };
    },
};
