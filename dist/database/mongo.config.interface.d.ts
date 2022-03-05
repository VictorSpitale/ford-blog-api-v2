export interface IMongoConfig {
    database: IMongoConfigOptions;
}
export interface IMongoConfigOptions {
    host: string;
    username: string;
    password: string;
    cluster_name: string;
    name: string;
    test_name: string;
}
