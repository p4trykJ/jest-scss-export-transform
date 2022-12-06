import sass from 'node-sass';
import { pathToFileURL } from 'url';
import { extractExports, getResolvedAliasedPath, scssToJson } from './helpers';
import type { Config } from './types';

module.exports = {
    process: function (
        sourceText: string,
        sourcePath: string,
        options: Config
    ) {
        const { alias } = options.transformerConfig;
        const result = sass.renderSync({
            file: sourcePath,
            importer: [
                function (url) {
                    const matchedPath = getResolvedAliasedPath(url, alias);
                    if (!matchedPath) return null;
                    const { pathname } = pathToFileURL(matchedPath);
                    return {
                        file: pathname,
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
