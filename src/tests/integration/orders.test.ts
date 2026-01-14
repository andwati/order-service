import request from "supertest";
import { describe, expect, it } from "vitest";

describe("GET /health", () => {
  it("returns 200 OK", async () => {
    // Minimal env required by app config during import
    process.env.MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/test";
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";

    const { default: app } = await import("../../app.js");

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "OK" });
  }, 20000);
});

