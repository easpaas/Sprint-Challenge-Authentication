const supertest = require("supertest");

const auth = require('./auth-router.js');
const server = require("../api/server.js");
const db = require("../database/dbConfig.js");

beforeEach(async () => {
  // this function executes and clears out the table before each test
  await db('users').truncate();
});

describe("auth router", () => {
  it("can run the tests", () => {
    expect(true).toBeTruthy();
  });

describe('POST /register', () => {
  describe('insert()', () => {
    it('should insert the provided user into the db', async () => {
      const user = { username: 'billy', password: 'password' };

      await db('users').insert(user);

      // read data from the table
      const users = await db('users');

      // verify that there are now two records inserted
      expect(users).toHaveLength(1);
    });
  });

    it("should return a 404 without user", () => {
      return supertest(server)
        .post("/users")
        .then(response => {
          expect(response.status).toBe(404)
        });
    });
  });

  describe("POST /login", () => {
    it('post without user will return not found', () => {
      return supertest(server)
        .post('/login')
        .then(response => {
          expect(response.notFound).toBe(true)
        });
    });

    it('post without user will return 404', () => {
      return supertest(server)
        .post('/login')
        .then(response => {
          // console.log(response)
          expect(response.status).toBe(404);
        });
    });
  });
});
