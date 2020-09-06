const { expect } = require("chai");
const app = require("../src/app");
const supertest = require("supertest");

describe("GET /", () => {
  it("should return an array of users", () => {
    return supertest(app)
      .get("/api/user")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
      });
  });
});

describe("POST /", () => {
  it("should throw an error if any keys are missing from the request body", () => {
    let data = {
      firstname: "test",
      lastname: "test",
      username: "test",
      password: "text",
      profilepicture: "test",
    };
    return supertest(app)
      .post("/api/user")
      .send(data)
      .expect(400, "Missing profilebio from request body");
  });
  it("if all keys are present and post is successful, it should return 201 and an array of the user info", () => {
    let data = {
      firstname: "test",
      lastname: "test",
      username: "test",
      password: "text",
      profilepicture: "test",
      profilebio: "test",
    };
    return supertest(app)
      .post("/api/user")
      .send(data)
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.include.all.keys(
          "firstname",
          "lastname",
          "username",
          "password",
          "profilepicture",
          "profilebio"
        );
      });
  });
});

describe("POST /login", () => {
  it("if credentials are valid, it should return 'OK'", () => {
    let data = {
      username: "testuser1",
      password: "testuser1password",
    };
    return supertest(app).post("/api/user/login").send(data).expect("OK");
  });
  it("should return 404 if the user does not exist", () => {
    let data = {
      username: "dummy",
      password: "dummypass",
    };
    return supertest(app)
      .post("/api/user/login")
      .send(data)
      .expect(404, "User doesn't exist");
  });
  it("should return 404 if the credentials are invalid", () => {
    let data = {
      username: "testuser1",
      password: "wrongpassword",
    };
    return supertest(app)
      .post("/api/user/login")
      .send(data)
      .expect(404, "Invalid credentials.");
  });
});

describe("GET /:user_id", () => {
  it("should return 404 if the user does not exist", () => {
    let query = { key: "10" };
    return supertest(app)
      .get(`/api/user/${query}`)
      .expect(404, "User doesn't exist");
  });
  it("should return an array of the user info", () => {
    let query = { key: "10" };
    return supertest(app)
      .get(`/api/user/${query}`)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
      });
  });
});

describe("DELETE /:user_id", () => {
  it("should return 204 if user is successfully deleted", () => {
    let query = { key: "11" };
    return supertest(app).delete(`/api/user/${query}`).send(data).expect(204);
  });
});

describe("PATCH /:user_id", () => {
  let query = { key: "testuser1" };
  it("return 400 if at least one key is not present", () => {
    let data = {
      bad: "bad",
    };
    return supertest(app)
      .patch(`/api/user/${query}`)
      .send(data)
      .expect(
        400,
        "Request body must contain either first name, last name, username, password, or picture"
      );
  });
  it("should return 204 if at least one key is present", () => {
    let data = {
      username: "changeusername",
    };
    return supertest(app).patch(`/api/user/${query}`).send(data).expect(204);
  });
});
