import db from "../db";

// Setup: inicializar la base de datos antes de todos los tests
beforeAll(async () => {
  await db.initialize();
});

// Teardown: cerrar la conexión después de todos los tests
afterAll(async () => {
  await db.close();
});
