const { expect } = require("chai");
const app = require("../src/app");
const supertest = require("supertest");

describe("GET /", () => {
  it("should return an array of all recipes in the database", () => {
    return supertest(app)
      .get("/api/recipe")
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
      });
  });
});

describe("POST /", () => {
  it("should return 400 if a key is missing from the request body", () => {
    let data = {
      username: "testuser1",
      recipename: "test",
      ingredients: "test",
      steps: "test",
    };
    return supertest(app)
      .post("/api/recipe")
      .send(data)
      .expect(400, "Missing recipephoto from request body");
  });
  it("should return 201 if all keys are present and recipe is posted to database", () => {
    let data = {
      username: "testuser1",
      recipename: "test",
      recipephoto: "test",
      ingredients: "test",
      steps: "test",
    };
    return supertest(app)
      .post("/api/recipe")
      .send(data)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
      });
  });
});

describe("GET /:recipe_id", () => {
  it("should return 404 if the recipe does not exist", () => {
    let query = { key: 23 };
    return supertest(app)
      .get(`/api/recipe/${query}`)
      .expect(404, "Recipe doesn't exist.");
  });
  it("should return an array with recipe info", () => {
    let query = { key: 1 };
    return supertest(app)
      .get(`/api/recipe${query}`)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.all.keys(
          "id",
          "username",
          "recipename",
          "recipephoto",
          "ingredients",
          "steps"
        );
      });
  });
});

describe("DELETE /:recipe_id", () => {
  it("should return 404 if the recipe does not exist", () => {
    return supertest(app)
      .delete("/api/recipe/43")
      .expect(404, "Recipe doesn't exist.");
  });
  it("should return 204 if the recipe is successfully deleted", () => {
    return supertest(app).delete("/api/recipe/1").expect(204);
  });
});

describe("PATCH /:recipe_id", () => {
  it("should return 400 if no keys are present", () => {
    let data = {
      bad: "dummy",
    };
    return supertest(app)
      .patch("/api/recipe/1")
      .send(data)
      .expect(
        400,
        "Request body must contain either recipename, recipephoto, ingredients, or instructions."
      );
  });
  it("should return 204 if recipe is successfully updated", () => {
    let data = {
      recipename: "Changed Recipe",
    };
    return supertest(app).patch("/api/recipe/1").send(data).expect(204);
  });
});
