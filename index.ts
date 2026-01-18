import { config } from "./src/config";
import db from "./src/db";

// TODO: Importar tu aplicación Express aquí
// import { app } from "./src/app";

async function start(): Promise<void> {
  await db.initialize();

  // TODO: Descomentar cuando hayas creado src/app.ts
  // app.listen(config.PORT, () => {
  //   console.log(`🎬 MIMO Movies API listening on port ${config.PORT}`);
  // });

  console.log(`✅ Database initialized`);
  console.log(`🎬 MIMO Movies API ready to be implemented!`);
  console.log(`   Port: ${config.PORT}`);
}

start();

