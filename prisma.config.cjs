require("dotenv").config();

module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
