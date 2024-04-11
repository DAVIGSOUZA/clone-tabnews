import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

const defaultMigrationOptions = {
  databaseUrl: process.env.DATABASE_URL,
  dryRun: true,
  noLock: true,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export default async function migrations(req, res) {
  if (req.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);

    return res.status(200).json(pendingMigrations);
  }

  if (req.method === "POST") {
    const resolvedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      noLock: false,
    });

    if (resolvedMigrations.length > 0) {
      return res.status(201).json(resolvedMigrations);
    }

    return res.status(200).json(resolvedMigrations);
  }

  return res.status(405).end();
}
