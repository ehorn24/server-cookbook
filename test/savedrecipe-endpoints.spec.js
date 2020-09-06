const { expect } = require("chai");
const app = require("../src/app");
const supertest = require("supertest");

describe("GET /", () => {
  it("should return an array of all saved recipes", () => {
    return supertest(app)
      .get("/api/savedrecipe")
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
      });
  });
});

describe("POST /", () => {
  it("should return 400 if any key is not present", () => {
    let data = {
      badkey: null,
    };
    return supertest(app).post("/api/savedrecipe").send(data).expect(400);
  });
  it("should return 201 an an array with the saved recipe id and the user who saved it", () => {
    let data = {
      recipe_id: 1,
      user_saved: "testuser1",
    };
    return supertest(app)
      .post("/api/savedrecipe")
      .send(data)
      .expect(201)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.all.keys("user_saved", "recipe_id");
      });
  });
});

describe("GET /:user_saved", () => {
  it("should return an array of all recipes a user has saved", () => {
    return supertest(app)
      .get("/api/savedrecipe/testuser1")
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
      });
  });
});

describe("POST /:user_saved", () => {
  it("Should return 400 if any key is missing", () => {
    let data = {
      badkey: null,
    };
    return supertest(app)
      .post("/api/savedrecipe/testuser1")
      .send(data)
      .expect(400);
  });
  it("Should return 201 if the recipe is saved and an array with the recipe info", () => {
    let data = {
      recipe_id: 2,
      user_saved: "testuser1",
    };
    return supertest(app)
      .post("/api/savedrecipe/testuser1")
      .send(data)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.all.keys("recipe_id", "user_saved");
      });
  });
});

describe("DELETE /:recipe_id/:user_saved", () => {
  it("should return 204 if the recipe is deleted", () => {
    return supertest(app).delete("/api/savedrecipe/2/testuser1").expect(204);
  });
});
