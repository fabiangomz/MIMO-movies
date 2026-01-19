import request from "supertest";
import { app } from "../app";

const API_KEY_USER_1 = "api_key_john_12345";

describe("Watchlist Endpoints", () => {
  describe("GET /watchlist/:userId", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/watchlist/1");

      expect(response.status).toBe(401);
    });

    it("should return watchlist for authenticated owner", async () => {
      const response = await request(app)
        .get("/watchlist/1")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 403 when accessing another user's watchlist", async () => {
      const response = await request(app)
        .get("/watchlist/2")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Forbidden");
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app)
        .get("/watchlist/99999")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "User not found");
    });

    it("should return watchlist items with correct fields", async () => {
      const response = await request(app)
        .get("/watchlist/1")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(200);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0]).toHaveProperty("movieId");
        expect(response.body.data[0]).toHaveProperty("title");
        expect(response.body.data[0]).toHaveProperty("watched");
        expect(response.body.data[0]).toHaveProperty("createdAt");
      }
    });

    it("should respect pagination parameters", async () => {
      const response = await request(app)
        .get("/watchlist/1?page=1&limit=5")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe("POST /watchlist/:userId/items", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/watchlist/1/items")
        .send({ movieId: 1 });

      expect(response.status).toBe(401);
    });

    it("should return 403 when adding to another user's watchlist", async () => {
      const response = await request(app)
        .post("/watchlist/2/items")
        .set("x-api-key", API_KEY_USER_1)
        .send({ movieId: 1 });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error", "Forbidden");
    });

    it("should return 404 for non-existent movie", async () => {
      const response = await request(app)
        .post("/watchlist/1/items")
        .set("x-api-key", API_KEY_USER_1)
        .send({ movieId: 99999 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Movie not found");
    });

    it("should return 422 for invalid payload", async () => {
      const response = await request(app)
        .post("/watchlist/1/items")
        .set("x-api-key", API_KEY_USER_1)
        .send({});

      expect(response.status).toBe(422);
    });

    it("should create watchlist item with Location header", async () => {
      const response = await request(app)
        .post("/watchlist/1/items")
        .set("x-api-key", API_KEY_USER_1)
        .send({ movieId: 10, watched: false });

      // Could be 201 (created) or 409 (already exists)
      if (response.status === 201) {
        expect(response.headers).toHaveProperty("location");
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("movieId", 10);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("watched", false);
      } else {
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty(
          "error",
          "Movie already in watchlist",
        );
      }
    });
  });

  describe("PATCH /watchlist/:userId/items/:itemId", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .patch("/watchlist/1/items/1")
        .send({ watched: true });

      expect(response.status).toBe(401);
    });

    it("should return 403 when updating another user's watchlist", async () => {
      const response = await request(app)
        .patch("/watchlist/2/items/1")
        .set("x-api-key", API_KEY_USER_1)
        .send({ watched: true });

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent item", async () => {
      const response = await request(app)
        .patch("/watchlist/1/items/99999")
        .set("x-api-key", API_KEY_USER_1)
        .send({ watched: true });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "Watchlist item not found",
      );
    });

    it("should return 422 for invalid payload", async () => {
      const response = await request(app)
        .patch("/watchlist/1/items/1")
        .set("x-api-key", API_KEY_USER_1)
        .send({ watched: "invalid" });

      expect(response.status).toBe(422);
    });
  });

  describe("DELETE /watchlist/:userId/items/:itemId", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app).delete("/watchlist/1/items/1");

      expect(response.status).toBe(401);
    });

    it("should return 403 when deleting from another user's watchlist", async () => {
      const response = await request(app)
        .delete("/watchlist/2/items/1")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent item", async () => {
      const response = await request(app)
        .delete("/watchlist/1/items/99999")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "Watchlist item not found",
      );
    });
  });
});
