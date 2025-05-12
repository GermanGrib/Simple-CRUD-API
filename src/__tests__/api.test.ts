import request from "supertest";
import server from "../server";

describe("Scenario 1: Full User Lifecycle (CRUD)", () => {
  let createdUserId: string;

  afterAll(() => {
    if (server && server.close) {
      server.close();
    }
  });

  test("1.1 GET /api/users should return empty array initially", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("1.2 POST /api/users should create a new user", async () => {
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

  test("1.3 GET /api/users/{userId} should return the created user", async () => {
    const response = await request(server).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
  });

  test("1.4 PUT /api/users/{userId} should update the user", async () => {
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

  test("1.5 DELETE /api/users/{userId} should delete the user", async () => {
    const response = await request(server).delete(
      `/api/users/${createdUserId}`,
    );
    expect(response.status).toBe(204);
  });

  test("1.6 GET /api/users/{userId} should return 404 after deletion", async () => {
    const response = await request(server).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(404);
  });
});

describe("Scenario 2: Validation and Error Handling", () => {
  test("2.1 POST invalid data - missing fields", async () => {
    const invalidUsers = [{ age: 25 }, { username: "Test" }, { hobbies: [] }];

    for (const user of invalidUsers) {
      const response = await request(server).post("/api/users").send(user);
      expect(response.status).toBe(400);
    }
  });

  test("2.2 POST invalid data - wrong types", async () => {
    const invalidUsers = [
      { username: 123, age: "25", hobbies: [] },
      { username: "Test", age: "not-a-number", hobbies: {} },
    ];

    for (const user of invalidUsers) {
      const response = await request(server).post("/api/users").send(user);
      expect(response.status).toBe(400);
    }
  });

  test("2.3 GET invalid UUID format", async () => {
    const response = await request(server).get("/api/users/invalid-id-123");
    expect(response.status).toBe(400);
  });
});

describe("Scenario 3: Negative Cases", () => {
  let testUserId: string;

  beforeAll(async () => {
    const response = await request(server)
      .post("/api/users")
      .send({ username: "Test", age: 30, hobbies: [] });
    testUserId = response.body.id;
  });

  afterAll(async () => {
    await request(server).delete(`/api/users/${testUserId}`);
  });

  test("3.1 GET non-existent user", async () => {
    const fakeId = "c779f4f6-0696-4957-a458-c6d4d8a89e2a";
    const response = await request(server).get(`/api/users/${fakeId}`);
    expect(response.status).toBe(404);
  });

  test("3.2 PUT to non-existent user", async () => {
    const fakeId = "c779f4f6-0696-4957-a458-c6d4d8a89e2a";
    const response = await request(server)
      .put(`/api/users/${fakeId}`)
      .send({ username: "Test" });
    expect(response.status).toBe(404);
  });

  test("3.3 DELETE non-existent user", async () => {
    const fakeId = "c779f4f6-0696-4957-a458-c6d4d8a89e2a";
    const response = await request(server).delete(`/api/users/${fakeId}`);
    expect(response.status).toBe(404);
  });

  test("3.4 GET non-existent endpoint", async () => {
    const response = await request(server).get("/api/nonexistent-endpoint");
    expect(response.status).toBe(404);
  });
});
