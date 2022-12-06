import sass from 'node-sass';
import { pathToFileURL } from 'url';
import { getResolvedAliasedPath, prepareOutput } from './helpers';
import type { Config } from './types';

module.exports = {
    process: function (
        sourceText: string,
        sourcePath: string,
        options: Config
    ) {
        const { alias } = options.transformerConfig;
        const scssResult = sass.renderSync({
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
        const result = prepareOutput(scssResult.css.toString());
        return {
            code: `module.exports = ${result}`,
        };
    },
};
