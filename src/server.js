const knex = require("knex");
const cors = require("cors");
const app = require("./app");
const { CLIENT_ORIGIN } = require("./config");
const { PORT, DATABASE_URL } = require("./config");

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
  searchPath: ["knex", "public"]
});

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.set("db", db);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
