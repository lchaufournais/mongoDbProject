import { Hono } from 'hono';
import { getMongoClient } from './mongoClient.js';
import { getRedisClient } from './redisClient.js';

const offers = new Hono();

offers.get('/', async (c) => {
  const from = c.req.query('from');
  const to = c.req.query('to');
  const limit = parseInt(c.req.query('limit') || '10');
  if (!from || !to) return c.text("Missing from or to", 400);

  const redis = await getRedisClient();
  const cacheKey = `offers:${from}:${to}`;
  const cached = await redis.get(cacheKey);
  if (cached) return c.json(JSON.parse(cached));

  const mongo = await getMongoClient();
  const data = await mongo.db().collection('offers')
    .find({ from, to })
    .sort({ price: 1 })
    .limit(limit)
    .toArray();

  await redis.setEx(cacheKey, 60, JSON.stringify(data));
  return c.json(data);
});

export default offers;
