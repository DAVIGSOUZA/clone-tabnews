import database from "infra/database.js";

export default async function status(req, res) {
  const updateAt = new Date().toISOString();

  const databaseQueryVersion = await database.query("SHOW server_version;");

  const databaseVersion = databaseQueryVersion.rows[0].server_version;

  const databaseQueryMaxConnections = await database.query(
    "SHOW max_connections;",
  );

  const databaseMaxConnections =
    databaseQueryMaxConnections.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const databaseQueryOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnections =
    databaseQueryOpenedConnections.rows[0].count;

  res.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(databaseMaxConnections),
        opened_connections: databaseOpenedConnections,
      },
    },
  });
}
