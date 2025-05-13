import { encrypt, generateToken } from '../../utils/encryption';
import { loginValidator, signupValidator, validateRequest } from '../../validators';

export const signupUser = async (body: any, db: any) => {
  // Validate the input
  const { success, errors } = validateRequest(signupValidator, body);

  if (!success) {
    return {
      status: 'error',
      code: 400,
      message: 'Validation failed',
      errors,
    };
  }

  const {email, username, password } = body;

  // Check if username already exists
  const existingUser = await db
    .selectFrom('users')
    .where('username', '=', username)
    .selectAll()
    .executeTakeFirst();

  if (existingUser) {
    return {
      status: 'error',
      code: 409,
      message: 'Username already exists',
    };
  }

  const existingUserByEmail = await db
  .selectFrom('users')
  .where('email', '=', email)
  .selectAll()
  .executeTakeFirst();

if (existingUserByEmail) {
  return {
    status: 'error',
    code: 409,
    message: 'Email already exists',
  };
}

  // Hash the password
  const hashedPassword = await encrypt(password);

  // Insert the new user into the database
  await db
    .insertInto('users')
    .values({
        email,
      username,
      password_hash: hashedPassword,
    })
    .execute();

  return {
    status: 'success',
    code: 201,
    message: 'User created successfully',
  };
};


export const loginUser = async (data: any, db: any) => {

  const { success, errors } = validateRequest(loginValidator, data);

  if (!success) {
    return {
      status: 'error',
      code: 400,
      message: 'Validation failed',
      errors,
    };
  }
  const { username, password } = data;

  // Basic input validation
  if (!username || !password) {
    return {
      status: 'error',
      code: 400,
      message: 'Username and password are required',
    };
  }

  try {
    // Check if user exists
    const user = await db
      .selectFrom('users')
      .where('username', '=', username)
      .select(['id', 'username', 'password_hash'])
      .executeTakeFirst();

    if (!user) {
      return {
        status: 'error',
        code: 404,
        message: 'User not found',
      };
    }

    // Verify password
    const encryptedPassword = await encrypt(password);

    if (encryptedPassword !== user.password_hash) {
      return {
        status: 'error',
        code: 401,
        message: 'Invalid password',
      };
    }


    // Generate token
    const token =await generateToken({ userId: user.id, username: user.username });

    return {
      status: 'success',
      code: 200,
      message: 'Login successful',
      token,
    };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      status: 'error',
      code: 500,
      message: 'An error occurred during login',
    };
  }
};
