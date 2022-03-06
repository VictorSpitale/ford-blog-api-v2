export default () => ({
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
  api_key: {
    key: process.env.API_KEY,
  },
});
