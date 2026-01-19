import request from "supertest";
import { app } from "../app";

const API_KEY_USER_1 = "api_key_john_12345";
const API_KEY_USER_2 = "api_key_jane_67890";

describe("Ratings Endpoints", () => {
  describe("GET /movies/:movieId/ratings", () => {
    it("should return ratings for a movie with pagination", async () => {
      const response = await request(app).get("/movies/1/ratings");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 404 for non-existent movie", async () => {
      const response = await request(app).get("/movies/99999/ratings");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Movie not found");
    });

    it("should return ratings with correct fields", async () => {
      const response = await request(app).get("/movies/1/ratings");

      expect(response.status).toBe(200);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0]).toHaveProperty("movieId");
        expect(response.body.data[0]).toHaveProperty("userId");
        expect(response.body.data[0]).toHaveProperty("rating");
        expect(response.body.data[0]).toHaveProperty("comment");
        expect(response.body.data[0]).toHaveProperty("createdAt");
      }
    });
  });

  describe("GET /movies/:movieId/ratings/:ratingId", () => {
    it("should return a specific rating", async () => {
      const response = await request(app).get("/movies/1/ratings/1");

      if (response.status === 200) {
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("movieId");
        expect(response.body).toHaveProperty("rating");
      } else {
        expect(response.status).toBe(404);
      }
    });

    it("should return 404 for non-existent rating", async () => {
      const response = await request(app).get("/movies/1/ratings/99999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Rating not found");
    });

    it("should return 404 for non-existent movie", async () => {
      const response = await request(app).get("/movies/99999/ratings/1");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Movie not found");
    });
  });

  describe("POST /movies/:movieId/ratings", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/movies/1/ratings")
        .send({ rating: 4, comment: "Great movie!" });

      expect(response.status).toBe(401);
    });

    it("should return 404 for non-existent movie", async () => {
      const response = await request(app)
        .post("/movies/99999/ratings")
        .set("x-api-key", API_KEY_USER_1)
        .send({ rating: 4, comment: "Great movie!" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Movie not found");
    });

    it("should return 422 for invalid rating value", async () => {
      const response = await request(app)
        .post("/movies/1/ratings")
        .set("x-api-key", API_KEY_USER_1)
        .send({ rating: 6, comment: "Invalid rating" });

      expect(response.status).toBe(422);
    });

    it("should return 422 for non-multiple of 0.5 rating", async () => {
      const response = await request(app)
        .post("/movies/1/ratings")
        .set("x-api-key", API_KEY_USER_1)
        .send({ rating: 3.7, comment: "Invalid rating" });

      expect(response.status).toBe(422);
    });

    it("should accept valid rating values (1, 1.5, 2, etc.)", async () => {
      const response = await request(app)
        .post("/movies/5/ratings")
        .set("x-api-key", API_KEY_USER_2)
        .send({ rating: 4.5, comment: "Great!" });

      // Could be 201 (created) or 409 (already rated)
      expect([201, 409]).toContain(response.status);
    });
  });

  describe("PATCH /movies/:movieId/ratings/:ratingId", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .patch("/movies/1/ratings/1")
        .send({ rating: 5 });

      expect(response.status).toBe(401);
    });

    it("should return 404 for non-existent rating", async () => {
      const response = await request(app)
        .patch("/movies/1/ratings/99999")
        .set("x-api-key", API_KEY_USER_1)
        .send({ rating: 5 });

      expect(response.status).toBe(404);
    });

    it("should return 422 for invalid rating value", async () => {
      const response = await request(app)
        .patch("/movies/1/ratings/1")
        .set("x-api-key", API_KEY_USER_1)
        .send({ rating: 10 });

      expect(response.status).toBe(422);
    });
  });

  describe("DELETE /movies/:movieId/ratings/:ratingId", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app).delete("/movies/1/ratings/1");

      expect(response.status).toBe(401);
    });

    it("should return 404 for non-existent rating", async () => {
      const response = await request(app)
        .delete("/movies/1/ratings/99999")
        .set("x-api-key", API_KEY_USER_1);

      expect(response.status).toBe(404);
    });
  });
});
