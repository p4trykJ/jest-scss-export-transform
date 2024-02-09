import { Alias } from '../dist/types.d';
import { extractExports, getResolvedAliasedPath } from '../src/helpers';

describe('helpers', () => {
    describe('getResolvedAliasedPath', () => {
        it('return existing aliased path', () => {
            const aliases: Alias = {
                '@alias0': 'assets/alias0',
                '@alias1': 'assets/alias1',
                '@alias2': 'assets/alias2',
                '@alias3': 'assets/alias3',
            };
            const expectedResults = [
                ['@alias0/rest/of/path.js', 'assets/alias0/rest/of/path.js'],
                ['@alias1/rest/of/path.js', 'assets/alias1/rest/of/path.js'],
                ['@alias2/rest/of/path.js', 'assets/alias2/rest/of/path.js'],
                ['@alias3/rest/of/path.js', 'assets/alias3/rest/of/path.js'],
            ];
            expectedResults.forEach(([aliasedPath, resolvedAlias]) => {
                expect(getResolvedAliasedPath(aliasedPath, aliases)).toBe(
                    resolvedAlias
                );
            });
        });

        it('return null when nonAliasedPaths are given', () => {
            const aliases: Alias = {
                '@alias0': 'assets/alias0',
                '@alias1': 'assets/alias1',
                '@alias2': 'assets/alias2',
                '@alias3': 'assets/alias3',
            };
            const givenPaths = [
                'non/aliased/path/1.js',
                'non/aliased/path/2.js',
                'non/aliased/path/3.js',
                'non/aliased/path/4.js',
            ];
            givenPaths.forEach((path) => {
                expect(getResolvedAliasedPath(path, aliases)).toBe(null);
            });
        });
    });

    describe.only('extractExports', () => {
        it('returns undefined when no text is given', () => {
            const scssAsText = '';
            const expectedResult = undefined;
            expect(extractExports(scssAsText)).toBe(expectedResult);
        });

        it('properly extract single export statement from scss', () => {
            const scssAsText = `
            html {
              font-size: 100px;
            }
            :export {
            primary: #6ebe3b;
            secondary: #a7afc6;
            success: #6ebe3b;
            info: rgb(10, 10, 10);
          }`;

            const expectedResult = `:export {
            primary: #6ebe3b;
            secondary: #a7afc6;
            success: #6ebe3b;
            info: rgb(10, 10, 10);
          }`;

            const result = extractExports(scssAsText);

            expect(result).toBe(expectedResult);
        });

        it('properly extract two export statements from scss', () => {
            const scssAsText = `:export {
          primary: #6ebe3b;
          secondary: #a7afc6;
          success: #6ebe3b;
          info: rgb(10, 10, 10);
        }

        html {
          font-size: 100px;
        }

        :export {
          primary2: #6ebe3b;
          secondary2: #a7afc6;
          success2: #6ebe3b;
          info2: rgb(10, 10, 10);
        }
        `;

            const expectedResult = `:export {
              primary: #6ebe3b;
              secondary: #a7afc6;
              success: #6ebe3b;
              info: rgb(10, 10, 10);
            }
    :export {
              primary2: #6ebe3b;
              secondary2: #a7afc6;
              success2: #6ebe3b;
              info2: rgb(10, 10, 10);
            }`;

            const expectedResultWithoutWhitespaces = expectedResult.replace(
                /\s+/g,
                ''
            );

            const result = extractExports(scssAsText);
            const resultWithoutWhitespaces = result.replace(/\s+/g, '');

            expect(resultWithoutWhitespaces).toBe(
                expectedResultWithoutWhitespaces
            );
        });
    });
});
