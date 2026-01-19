import request from "supertest";
import { app } from "../app";

describe("Movies Endpoints", () => {
  describe("GET /movies", () => {
    it("should return a list of movies with pagination", async () => {
      const response = await request(app).get("/movies");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toHaveProperty("page");
      expect(response.body.pagination).toHaveProperty("limit");
      expect(response.body.pagination).toHaveProperty("total");
      expect(response.body.pagination).toHaveProperty("totalPages");
    });

    it("should return movies with rating field", async () => {
      const response = await request(app).get("/movies");

      expect(response.status).toBe(200);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0]).toHaveProperty("title");
        expect(response.body.data[0]).toHaveProperty("genre");
        expect(response.body.data[0]).toHaveProperty("duration");
        expect(response.body.data[0]).toHaveProperty("rating");
      }
    });

    it("should respect pagination parameters", async () => {
      const response = await request(app).get("/movies?page=1&limit=5");

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe("GET /movies/:id", () => {
    it("should return a movie by id", async () => {
      const response = await request(app).get("/movies/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("genre");
      expect(response.body).toHaveProperty("duration");
      expect(response.body).toHaveProperty("rating");
    });

    it("should return 404 for non-existent movie", async () => {
      const response = await request(app).get("/movies/99999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Movie not found");
    });

    it("should return 404 for invalid movie id", async () => {
      const response = await request(app).get("/movies/invalid");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Movie not found");
    });
  });
});
