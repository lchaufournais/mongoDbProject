import { getMongoClient } from './mongoClient.js'
import { getNeo4jDriver } from './neo4jClient.js'
import { ObjectId } from 'mongodb'

export async function seedData() {
  const mongo = await getMongoClient()
  const offers = mongo.db().collection('offers')

  await offers.deleteMany({})
  await offers.createIndex({ from: 1, to: 1, price: 1 })
  await offers.createIndex({ provider: "text" })

  await offers.insertMany([
    {
      _id: new ObjectId("64f123456789abcdef012345"),
      from: "PAR",
      to: "TYO",
      departDate: new Date(),
      returnDate: new Date(),
      provider: "AirZen",
      price: 750,
      currency: "EUR",
      legs: [{ flightNum: "AZ123", dep: "PAR", arr: "TYO", duration: 720 }],
      hotel: { name: "Zen Hotel", nights: 5, price: 300 },
      activity: { title: "Temple Tour", price: 120 }
    }
  ])

  const driver = getNeo4jDriver()
  const session = driver.session()

  await session.run("MATCH (n) DETACH DELETE n")
  await session.run("CREATE (p:City {code: 'PAR', name: 'Paris', country: 'FR'})")
  await session.run("CREATE (t:City {code: 'TYO', name: 'Tokyo', country: 'JP'})")
  await session.run("MATCH (p:City {code: 'PAR'}), (t:City {code: 'TYO'}) CREATE (p)-[:NEAR {weight: 0.8}]->(t)")

  await session.close()
  await driver.close()
}
