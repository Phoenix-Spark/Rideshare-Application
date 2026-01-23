const { defineConfig } = require("@prisma/config");
require("dotenv").config();

module.exports = defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
