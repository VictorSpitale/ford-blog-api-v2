declare const _default: () => {
    port: string | number;
    database: {
        host: string;
        username: string;
        password: string;
        cluster_name: string;
        name: string;
        test_name: string;
        dev_name: string;
        bucket_name: string;
    };
    jwt: {
        secret: string;
    };
    api_key: {
        key: string;
    };
};
export default _default;
