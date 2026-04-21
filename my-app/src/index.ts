import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import type { LoginSchema } from '../schemas/responseSchemas.js';
import { users } from '../schemas/databaseSchemas.js';

// Database password is z9hTBmX7JE0bNvMD;
const app = new Hono();

// The exclamation is known as a non-null assertion. Look it up if needed.
const connectionString : string = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false});
const db = drizzle(client);

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.post('/login', async (c) => {
  // Grabs body from the request. Ensures it matches the schema.
  const { username, password} = await c.req.json<LoginSchema>();

  // Sanitize Data.

  // Check if The Data Is Valid.
});

app.post('/register', async (c) => {
  console.log('Register Route Has Been Tagged');
  const { username, password } = await c.req.json<LoginSchema>();
  // Sanitize Data.

  // Check if the user is already in the database.

  // Create user.
  const result = await db.insert(users).values({
    username,
    password,
  }).returning();

  return c.json(result);
})

// Route responsible for fetching game by name.
app.get('/search/:name', async (c) => {

  // Grabs name from the URL.
  const name = c.req.param('name');

  // Makes fetch call to the API.
  const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_SECRET}&search=${name}`, {
    method: 'GET',
  });

  // Check the response.
  if(!response.ok) {
    console.log('Error');
    return c.text(response.statusText);
  }

  // Parse response.
  const data = await response.json();

  return c.json(data);
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
