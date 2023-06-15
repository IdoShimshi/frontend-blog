import '@testing-library/jest-dom'
import handleLogin from "../../../../pages/api/auth/login";
import { createMocks } from "node-mocks-http";


describe("/api/auth/login", () =>{
    test("should login sucsessfuly", async () =>{
      
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                username: 'User1',
                password: 'user1pass',
            },
          });
          // this should be mocked in the database, but mocking prisma for testing is out of course scope

          await handleLogin(req, res);

          expect(res._getStatusCode()).toBe(200);

          const responseBody = await JSON.parse(res._getData());
          expect(responseBody.email).toBe("user1@example.com")
          expect(responseBody.token).toBeDefined()
    });

    test("should fail login, wrong password", async () =>{
      
      const { req, res } = createMocks({
          method: 'POST',
          body: {
              username: 'User1',
              password: 'wrongpass',
          },
        });
        // this should be mocked in the database, but mocking prisma for testing is out of course scope
        await handleLogin(req, res);
        expect(res._getStatusCode()).toBe(401);
  });

  test("should fail login, username doesnt exist", async () =>{
      
    const { req, res } = createMocks({
        method: 'POST',
        body: {
            username: 'thisUsernameDoesntExist',
            password: 'somepass',
        },
      });
      // this should be mocked in the database, but mocking prisma for testing is out of course scope
      await handleLogin(req, res);
      expect(res._getStatusCode()).toBe(401);
});
});


// describe('/api/[animal]', () => {
//   test('returns a message with the specified animal', async () => {
//     const { req, res } = createMocks({
//       method: 'POST',
//       body: {
//           username: 'User1',
//           password: 'user1pass',
//       },
//     });

//     await handleLogin(req, res);

//     expect(res._getStatusCode()).toBe(200);
//     expect(JSON.parse(res._getData())).toEqual(
//       expect.objectContaining({
//         message: 'Your favorite animal is dog',
//       }),
//     );
//   });
// });

