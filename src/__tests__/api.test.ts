import request from "supertest";
import server from "../server";

describe("API Tests", () => {
  let createdUserId: string;

  afterAll(() => {
    if (server && server.close) {
      server.close();
    }
  });

  test("GET /api/users should return empty array initially", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /api/users should create a new user", async () => {
    const newUser = {
      username: "TestUser",
      age: 25,
      hobbies: ["basketball", "programming", "rs-school-courses"],
    };

    const response = await request(server).post("/api/users").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(newUser.hobbies);

    createdUserId = response.body.id;
  });

  test("GET /api/users/{userId} should return the created user", async () => {
    const response = await request(server).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
  });

  test("PUT /api/users/{userId} should update the user", async () => {
    const updatedData = {
      username: "UpdatedUser",
      age: 31,
      hobbies: ["kite-surfing", "women", "motorcycles"],
    };

    const response = await request(server)
      .put(`/api/users/${createdUserId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe(updatedData.username);
    expect(response.body.age).toBe(updatedData.age);
    expect(response.body.hobbies).toEqual(updatedData.hobbies);
  });

  test("DELETE /api/users/{userId} should delete the user", async () => {
    const response = await request(server).delete(
      `/api/users/${createdUserId}`,
    );
    expect(response.status).toBe(204);
  });

  test("GET /api/users/{userId} should return 404 after deletion", async () => {
    const response = await request(server).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(404);
  });

  test("GET non-existent endpoint should return 404", async () => {
    const response = await request(server).get("/api/nonexistent");
    expect(response.status).toBe(404);
  });

  test("POST /api/users with invalid data should return 400", async () => {
    const invalidUser = { username: "Test" };
    const response = await request(server).post("/api/users").send(invalidUser);
    expect(response.status).toBe(400);
  });

  test("GET /api/users/{userId} with invalid UUID should return 400", async () => {
    const response = await request(server).get("/api/users/invalid-id");
    expect(response.status).toBe(400);
  });
});
