import { Alias } from '../dist/types.d';
import { getResolvedAliasedPath } from '../src/helpers';

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
});
