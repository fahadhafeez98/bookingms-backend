import app from '../app';
import { loginUser, signupUser } from '../services/users';

app.post('/user/signup', async (c) => {
  try {
    const body = await c.req.json();

    // Call the signup service
    const result = await signupUser(body, globalThis.env.DB);

    // Return the result from the service
    return c.json(
      {
        status: result.status,
        message: result.message,
        ...(result.errors && { errors: result.errors }),
      },
      result.code
    );
  } catch (error) {
    console.error('Error during signup:', error);

    return c.json(
      {
        status: 'error',
        message: 'Failed to create user',
      },
      500
    );
  }
})

.post('/user/login', async (c) => {
  try {
    const body = await c.req.json();

    // Call the login service
    const result = await loginUser(body, globalThis.env.DB);

    // Return the result from the service
    return c.json(
      {
        status: result.status,
        message: result.message,
        ...(result.token && { token: result.token }),
        ...(result.errors && { errors: result.errors }),
      },
      result.code
    );
  } catch (error) {
    console.error('Error during login:', error);

    return c.json(
      {
        status: 'error',
        message: 'Failed to login user',
      },
      500
    );
  }
});


app.get('/test-route', async (c) => {
  try {
    // const body = await c.req.json();

    let db = globalThis.env.DB;

    // Call the signup service
    const user = await db
    .selectFrom('User')
    // .where('username', '=', username)
    .selectAll()
    .executeTakeFirst();
    // Return the result from the service
    return c.json(
      {
        status: user,
        message: 'message'
      },
      
    );
  } catch (error) {
    console.error('Error during signup:', error);

    return c.json(
      {
        status: 'error',
        message: 'Failed to create user',
      },
      500
    );
  }
})
