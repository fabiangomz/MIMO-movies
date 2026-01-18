# MIMO Movies API

API RESTful para gestionar películas, valoraciones y watchlists de usuarios.

## 🎯 Objetivo

Implementar una API REST completa siguiendo la especificación OpenAPI proporcionada en `doc/mimo_movies.json`.

## 📁 Estructura del Proyecto

```
mimo-movies/
├── src/
│   ├── config.ts              # ✅ Configuración (proporcionado)
│   ├── db.ts                  # ✅ Conexión y modelos Sequelize (proporcionado)
│   ├── models/                # ✅ Capa de modelo (proporcionado)
│   │   ├── user.ts
│   │   ├── movie.ts
│   │   ├── rating.ts
│   │   └── watchlistItem.ts
│   ├── app.ts                 # ❌ TODO: Configuración de Express
│   ├── controllers/           # ❌ TODO: Controladores
│   │   ├── movies.ts
│   │   ├── ratings.ts
│   │   └── watchlist.ts
│   ├── middlewares/           # 🔁 TODO: Middlewares
│   │   ├── errorHandler.ts
│   │   ├── notFoundHandler.ts
│   │   ├── verifyApiKey.ts
│   │   └── validatePayload.ts
│   ├── routes/                # ❌ TODO: Rutas
│   │   ├── movies.ts
│   │   ├── ratings.ts
│   │   └── watchlist.ts
│   ├── schemas/               # ❌ TODO: Esquemas de validación Joi
│   │   ├── rating.ts
│   │   └── watchlist.ts
│   └── utils/                 # ❌ TODO: Utilidades
│       ├── pagination.ts
│       └── serializers.ts
├── scripts/
│   ├── seed.ts                # ✅ Script para poblar BD (proporcionado)
│   └── reset.ts               # ✅ Script para resetear BD (proporcionado)
├── doc/
│   ├── mimo_movies.json       # ✅ Especificación OpenAPI
│   └── Evaluación.md          # ✅ Criterios de evaluación
├── index.ts                   # ✅ Entry point (proporcionado)
└── README.md
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Poblar la base de datos con datos de prueba
npm run db:seed
```

## 📜 Scripts Disponibles

| Script             | Descripción                                          |
| ------------------ | ---------------------------------------------------- |
| `npm run dev`      | Inicia el servidor en modo desarrollo con hot-reload |
| `npm run build`    | Compila TypeScript a JavaScript                      |
| `npm start`        | Inicia el servidor compilado                         |
| `npm run db:seed`  | Crea y pobla la base de datos con datos de prueba    |
| `npm run db:reset` | Elimina la base de datos (para empezar de cero)      |
| `npm test`         | Ejecuta los tests                                    |

## 🔑 Datos de Prueba

Después de ejecutar `npm run db:seed`, tendrás disponibles los siguientes usuarios:

| Usuario    | API Key              |
| ---------- | -------------------- |
| john_doe   | `api_key_john_12345` |
| jane_smith | `api_key_jane_67890` |
| bob_wilson | `api_key_bob_11111`  |

## 📖 Especificación de la API

Consulta el archivo `doc/mimo_movies.json` para ver la especificación OpenAPI completa. Puedes visualizarla en [Swagger Editor](https://editor.swagger.io/).

### Endpoints a Implementar

#### Películas (`/movies`)

- `GET /movies` - Listar películas (con paginación)
- `GET /movies/:movieId` - Obtener detalles de una película

#### Valoraciones (`/movies/:movieId/ratings`)

- `GET /movies/:movieId/ratings` - Listar valoraciones de una película
- `POST /movies/:movieId/ratings` - Crear valoración (autenticado)
- `GET /movies/:movieId/ratings/:ratingId` - Obtener valoración específica
- `PATCH /movies/:movieId/ratings/:ratingId` - Modificar valoración (solo autor)
- `DELETE /movies/:movieId/ratings/:ratingId` - Eliminar valoración (solo autor)

#### Watchlist (`/watchlist/:userId`)

- `GET /watchlist/:userId` - Obtener watchlist (solo propietario)
- `POST /watchlist/:userId/items` - Añadir película al watchlist (solo propietario)
- `PATCH /watchlist/:userId/items/:itemId` - Actualizar item (solo propietario)
- `DELETE /watchlist/:userId/items/:itemId` - Eliminar item (solo propietario)

## 🔐 Autenticación

La API utiliza autenticación mediante API Key en el header `x-api-key`:

```bash
curl -H "x-api-key: api_key_john_12345" http://localhost:3000/watchlist/1
```

## 📝 Tareas a Realizar

1. **Crear `src/app.ts`**: Configurar Express con middlewares básicos
2. **Implementar middlewares**:
   - `errorHandler.ts`: Manejo centralizado de errores
   - `notFoundHandler.ts`: Respuesta 404 para rutas no encontradas
   - `verifyApiKey.ts`: Verificar autenticación por API Key
   - `validatePayload.ts`: Validar payloads con Joi
3. **Implementar rutas y controladores**:
   - Movies: Listar y obtener películas
   - Ratings: CRUD de valoraciones
   - Watchlist: CRUD de watchlist
4. **Implementar esquemas de validación Joi**
5. **Implementar utilidades**:
   - `pagination.ts`: Helper para paginación
   - `serializers.ts`: Formatear respuestas

## 📚 Recursos

- [Especificación OpenAPI](./doc/mimo_movies.json)
- [Criterios de Evaluación](./doc/Evaluación.md)

## 🐛 Debugging en VS Code

El proyecto incluye configuraciones de depuración en `.vscode/launch.json`. Para depurar:

1. **Abre el panel de Debug** (`Ctrl+Shift+D` / `Cmd+Shift+D`)
2. **Selecciona una configuración** del desplegable:

| Configuración                      | Uso                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------- |
| **Debug TypeScript (ts-node-dev)** | Depuración en desarrollo. Ejecuta `npm run dev` con soporte de breakpoints |
| **Debug Compiled JavaScript**      | Compila primero (`npm run build`) y depura el código compilado en `dist/`  |
| **Attach to Process**              | Conecta a un proceso Node.js ya en ejecución (puerto 9229)                 |

3. **Añade breakpoints** haciendo clic en el margen izquierdo de cualquier archivo `.ts`
4. **Pulsa F5** o el botón ▶️ para iniciar la depuración

### Ejemplo de uso

```
1. Pon un breakpoint en tu controlador (ej: src/controllers/movies.ts)
2. Selecciona "Debug TypeScript (ts-node-dev)"
3. Pulsa F5
4. Haz una petición: curl http://localhost:3000/movies
5. El debugger se detendrá en tu breakpoint
```

## 🧪 Testing

Para probar tu API puedes usar:

- [Postman](https://www.postman.com/)
- curl desde terminal

Ejemplo de prueba:

```bash
# Listar películas
curl http://localhost:3000/movies

# Obtener película específica
curl http://localhost:3000/movies/1

# Crear valoración (autenticado)
curl -X POST http://localhost:3000/movies/1/ratings \
  -H "Content-Type: application/json" \
  -H "x-api-key: api_key_john_12345" \
  -d '{"rating": 4.5, "comment": "Excelente película"}'

# Obtener watchlist (autenticado)
curl http://localhost:3000/watchlist/1 \
  -H "x-api-key: api_key_john_12345"
```
