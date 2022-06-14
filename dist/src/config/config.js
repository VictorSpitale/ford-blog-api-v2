"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: process.env.PORT || 8080,
    database: {
        host: process.env.DB_URI,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        cluster_name: process.env.DB_CLUSTER_NAME,
        name: process.env.DB_NAME,
        test_name: process.env.DB_TEST_NAME,
        dev_name: process.env.DB_DEV_NAME,
        bucket_name: process.env.BUCKET_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    client_url: process.env.CLIENT_URL,
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_SECRET,
        callback: process.env.GOOGLE_CALLBACK_URL,
        client_url: process.env.CLIENT_URL,
        storage: {
            project_name: process.env.GOOGLE_CLOUD_PROJECT_NAME,
            client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
        },
    },
    email: {
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        to: process.env.MAIL_TO,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
});
//# sourceMappingURL=config.js.map