const supertest = require("supertest");

const server = require("../api/server.js");
const db = require("../database/dbConfig.js");

describe("auth router", () => {
  it("can run the tests", () => {
    expect(true).toBeTruthy();
  });

  describe("POST /register", () => {
    it.todo('username and password both exist')
    it.todo('can post to register and recieve status code 201')
    it.todo('returns a user object with username and token ')
  });

  describe("POST /login", () => {
    it.todo('username and password both exist')
    it.todo('can post to login successfully with status code 201');
  });
});
