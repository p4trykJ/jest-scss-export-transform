export interface Alias {
    [alias: string]: string;
}

export interface Config {
    transformerConfig: {
        alias: Alias;
    };
}
