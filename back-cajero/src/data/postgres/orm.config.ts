import { DataSource } from "typeorm";
import { envs } from "../../config";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const AppDataSource = new DataSource({
  type: "postgres",
  host: envs.POSTGRE_HOST,
  port: envs.POSTGRE_PORT,
  username: envs.POSTGRE_USER,
  password: envs.POSTGRE_PASS,
  database: envs.POSTGRE_DB_NAME,
  entities: ["src/data/postgres/entities/*.ts"],
  synchronize: true,
  logging: false,
  ssl: true,
});

async function loadProcedures() {
  // Ruta corregida - desde orm.config.ts hasta procedures/contract
  const procedurePath = join(__dirname, "procedures", "contract");

  console.log("Buscando procedimientos en:", procedurePath); // Para depuración

  try {
    const files = readdirSync(procedurePath).filter((file) =>
      file.endsWith(".sql")
    );

    for (const file of files) {
      const sql = readFileSync(join(procedurePath, file), "utf8");
      await AppDataSource.query(sql);
    }
  } catch (error) {
    console.error("Error cargando procedimientos:", error);
    throw error; // Propaga el error para detener la inicialización
  }
}

AppDataSource.initialize()
  .then(async () => {
    console.log("Data source has been initialized!");
    await loadProcedures();
    console.log("Stored procedures loaded!");
  })
  .catch((err) => {
    console.error("Error initializing dataSource:", err);
  });

export { AppDataSource };
