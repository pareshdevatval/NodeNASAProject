const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.models");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should return 200 response status", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "test",
      rocket: "test",
      target: "Kepler-283 c",
      launchDate: "January 4, 2016",
    };

    const launchDataWithoutLaunchDate = {
      mission: "test",
      rocket: "test",
      target: "Kepler-283 c",
    };

    const launchDataWithInvalidLaunchDate = {
      mission: "test",
      rocket: "test",
      target: "Kepler-283 c",
      launchDate: "Hello",
    };

    test("It should return 201 response status", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("content-type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutLaunchDate);
    });

    test("It should catch missing parameters error", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutLaunchDate)
        .expect("content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "All fields are required",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidLaunchDate)
        .expect("content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
