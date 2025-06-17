import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { getRedisClient } from './redisClient.js';

const login = new Hono();

login.post('/', async (c) => {
  const body = await c.req.json();
  const userId = body.userId;
  if (!userId) return c.text("Missing userId", 400);

  const token = uuidv4();
  const redis = await getRedisClient();
  await redis.setEx(`session:${token}`, 900, userId);
  return c.json({ token, expires_in: 900 });
});

export { login };
