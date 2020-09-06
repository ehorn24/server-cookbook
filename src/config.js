module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://ellahorn@localhost:5432/cookstagram"
};
