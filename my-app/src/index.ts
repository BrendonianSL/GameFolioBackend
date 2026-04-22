import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { LoginSchema } from '../schemas/responseSchemas.js';
import { users, test } from '../schemas/databaseSchemas.js';
import { eq } from 'drizzle-orm';

// Database password is z9hTBmX7JE0bNvMD;
// Install XSS, Hono Cors, ZORPC, And Hono CSRF. Look into API Keys.
const app = new Hono();

// The exclamation is known as a non-null assertion. Look it up if needed.
const connectionString : string = 'postgresql://postgres.abkcgepzksnuyrqcgfav:z9hTBmX7JE0bNvMD@aws-1-us-east-2.pooler.supabase.com:6543/postgres';
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.post('/register', zValidator('json', LoginSchema), async (c) => {
  // console.log('Register Route Has Been Tagged');

  // Validate User Input From Post Request.
  const { username, password } = c.req.valid('json');

  // Check if the user is already in the database.
  const user = await db.select().from(users).where(eq(users.username, username));

  if (user.length > 0) return c.json({
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

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
