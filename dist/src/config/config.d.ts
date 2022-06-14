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
    client_url: string;
    google: {
        client_id: string;
        secret: string;
        callback: string;
        client_url: string;
        storage: {
            project_name: string;
            client_email: string;
            private_key: string;
        };
    };
    email: {
        username: string;
        password: string;
        to: string;
    };
    redis: {
        host: string;
        port: string;
        username: string;
        password: string;
    };
};
export default _default;
