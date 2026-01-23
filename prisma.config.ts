import { config } from "dotenv";

config();

export default {
  migrations: {
    path: "prisma/migrations",
    seed: 'tsx prisma/seed.ts',
  },
};