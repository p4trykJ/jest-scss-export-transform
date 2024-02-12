# jest-scss-export-transform

Jest transformer for [.scss files](https://sass-lang.com/).

Allows the :export SCSS statement to be correctly parsed in the Jest tests.

## Install

### If your project uses node-sass use v1 and v2 if it uses sass.

`npm i -D jest-scss-export-transform`

or

`yarn add -D jest-scss-export-transform`

or

`pnpm i -D jest-scss-export-transform`

## Add to your Jest config

Using `jest.config.js`:

```javascript
module.exports = {
    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.scss$': [
            'jest-scss-export-transform',
            {
                alias: {
                    '@style': './assets/style',
                },
            },
        ],
    },
};
```
