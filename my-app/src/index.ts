import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { UserInfoSchema } from '../schemas/responseSchemas.js';
import { users } from '../schemas/databaseSchemas.js';
import { eq } from 'drizzle-orm';
import type { ResponseSchema } from '../schemas/responseSchemas.js'
import bcrypt from 'bcrypt';

// Database password is z9hTBmX7JE0bNvMD;
// Install XSS, Hono Cors, ZORPC, And Hono CSRF. Look into API Keys.
const app = new Hono();

// The exclamation is known as a non-null assertion. Look it up if needed.
const connectionString : string = 'postgresql://postgres.abkcgepzksnuyrqcgfav:z9hTBmX7JE0bNvMD@aws-1-us-east-2.pooler.supabase.com:6543/postgres';
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);
const verifyPassword = (password: string) => {
  if(password.length < 8) return false; 
  if(!/[A-Z]/.test(password)) return false;
  if(!/[a-z]/.test(password)) return false;
  if(!/[0-9]/.test(password)) return false;
  if(!/[!@#$%^&*]/.test(password)) return false;
  return true;
}

app.get('/', (c) => {
  return c.text('Hello From Hono!')
});

app.post('/login', zValidator('json', UserInfoSchema), async(c) => {
  // Destructure the request body.
  const { username, password } = await c.req.json();

  // Check if the user is already in the database.
  const user = await db.select().from(users).where(eq(users.username, username));

  // If the user doesn't exist, return an error.
  if (user.length < 0) {
    return c.json<ResponseSchema>({
      message: 'User not found. Please register an account.',
      status: 404,
    }, 404);
  }

  // If the user exists, grab the password and verift it.
  const isValidPassword = await bcrypt.compare(password, user[0].password);

  if(!isValidPassword) {
    return c.json<ResponseSchema>({
      message: 'Invalid Password.',
      status: 401,
    }, 401);
  }

  // If the password is valid, start a session and return a success message.
  return c.json<ResponseSchema>({
    message: 'Login successful',
    status: 200,
  }, 200);
})

app.post('/register', zValidator('json', UserInfoSchema), async (c) => {
  // console.log('Register Route Has Been Tagged');

  // Validate User Input From Post Request.
  const { username, password } = c.req.valid('json');

  // Check if the user is already in the database.
  const user = await db.select().from(users).where(eq(users.username, username));

  if (user.length > 0) return c.json<ResponseSchema>({
    message: 'User already exists',
    status: 400
  }, 400);

  // Create user.
  const result = await db.insert(users).values({ username, password});

  if(result) {
    // console.log('User creation successful');
    return c.text('User has been created successfully', 201); 
  } else {
    // console.log('User creation failed');
    return c.text('User creation failed', 400);
  }
});

app.get('/:username', async (c) => {
  // Grab everything from the user.
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
