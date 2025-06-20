import { Hono } from 'hono';
import { getMongoClient } from './mongoClient.js';
import { getRedisClient } from './redisClient.js';
import { ObjectId } from 'mongodb'
import { getNeo4jDriver } from './neo4jClient.js'

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

offers.post('/', async (c) => {
  const body = await c.req.json();
  const { from, to, provider, price, currency, legs } = body;
  if (!from || !to) return c.text("Missing from or to", 400);

  const mongo = await getMongoClient();
  const result = await mongo.db().collection('offers').insertOne({
    from, to, provider, price, currency, legs
  });

  const redis = await getRedisClient();
  await redis.publish(
    'offers:new',
    JSON.stringify({ offerId: result.insertedId.toString(), from, to })
  );

  return c.json({ insertedId: result.insertedId });
});

offers.get('/:id', async (c) => {
  const id = c.req.param('id')

  if (!ObjectId.isValid(id)) return c.text('Invalid offer ID', 400)

  const redis = await getRedisClient()
  const cacheKey = `offers:${id}`
  const cached = await redis.get(cacheKey)
  if (cached) return c.json(JSON.parse(cached))

  const mongo = await getMongoClient()
  const offer = await mongo.db().collection('offers').findOne({ _id: new ObjectId(id) })
  if (!offer) return c.text('Offer not found', 404)

  // Rechercher les villes proches via Neo4j
  const driver = getNeo4jDriver()
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (c:City {code: $to})-[:NEAR]->(n:City)
       RETURN n.code AS code LIMIT 5`,
      { to: offer.to }
    )
    const nearbyCities = result.records.map(r => r.get('code'))

    // Requête MongoDB pour trouver des offres similaires
    const related = await mongo.db().collection('offers').find({
      from: offer.from,
      to: { $in: nearbyCities },
      departDate: { $gte: offer.departDate, $lte: offer.returnDate },
      _id: { $ne: offer._id } // exclure l’offre elle-même
    })
      .project({ _id: 1 })
      .limit(3)
      .toArray()

    const relatedOffers = related.map(o => o._id.toString())
    offer.relatedOffers = relatedOffers

    // Cache résultat
    await redis.setEx(cacheKey, 300, JSON.stringify(offer))

    return c.json(offer)
  } catch (err: any) {
    return c.text(`Erreur Neo4j : ${err.message}`, 500)
  } finally {
    await session.close()
    await driver.close()
  }
})

export default offers;
