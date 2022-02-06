export default () => ({
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_URI,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    cluster_name: process.env.DB_CLUSTER_NAME,
    name: process.env.DB_NAME,
    test_name: process.env.DB_TEST_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
