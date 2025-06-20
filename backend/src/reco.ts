import { Hono } from 'hono'
import { getNeo4jDriver } from './neo4jClient.js'

const reco = new Hono()

reco.get('/', async (c) => {
  const city = c.req.query('city')
  const k = parseInt(c.req.query('k') || '3', 10)
  if (!city) return c.text("Missing city", 400)

  const driver = getNeo4jDriver()
  const session = driver.session()

  try {
    const result = await session.run(
      `MATCH (c:City {code:$city})-[r:NEAR]->(n:City)
       RETURN n.code AS city, r.weight AS score
       ORDER BY r.weight DESC
       LIMIT toInteger($k)`,
      { city, k }
    )

    const recommendations = result.records.map(r => ({
      city: r.get('city'),
      score: r.get('score')
    }))

    return c.json(recommendations)
  } finally {
    await session.close()
    await driver.close()
  }
})

export { reco }
