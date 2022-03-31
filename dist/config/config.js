"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: process.env.PORT || 5000,
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
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_SECRET,
        callback: process.env.GOOGLE_CALLBACK_URL,
        client_url: process.env.CLIENT_URL,
    },
});
//# sourceMappingURL=config.js.map