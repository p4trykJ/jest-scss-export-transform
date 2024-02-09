import { compile } from 'sass';
import { pathToFileURL } from 'url';
import { getResolvedAliasedPath, handleError, prepareOutput } from './helpers';
import type { Config } from './types';

module.exports = {
    process: function (
        sourceText: string,
        sourcePath: string,
        options: Config
    ) {
        const { alias } = options.transformerConfig;
        try {
            const scssResult = compile(sourcePath, {
                importers: [
                    {
                        findFileUrl(sourceUrl) {
                            const matchedPath = getResolvedAliasedPath(
                                sourceUrl,
                                alias
                            );
                            if (!matchedPath) return null;
                            const url = pathToFileURL(matchedPath);
                            return url as URL;
                        },
                    },
                ],
            });
            const result = prepareOutput(scssResult.css.toString());
            return {
                code: `module.exports = ${result}`,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                handleError(error.message);
            }
            throw error;
        }
    },
};
