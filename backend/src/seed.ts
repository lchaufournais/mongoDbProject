import { getMongoClient } from './mongoClient.js'
import { getNeo4jDriver } from './neo4jClient.js'
import { ObjectId } from 'mongodb'

export async function seedData() {
  const mongo = await getMongoClient()
  const offers = mongo.db().collection('offers')

  await offers.deleteMany({})
  await offers.createIndex({ from: 1, to: 1, price: 1 })
  await offers.createIndex({ provider: 'text' })

  const routes = [
    { from: 'PAR', to: 'TYO' },
    { from: 'PAR', to: 'NYC' },
    { from: 'PAR', to: 'LON' },
    { from: 'TYO', to: 'PAR' },
    { from: 'TYO', to: 'NYC' },
    { from: 'NYC', to: 'PAR' }
  ]

  const providers = ['AirZen', 'SkyHigh', 'JetStream', 'NipponAir', 'EuroWings']
  const hotels = ['Zen Hotel', 'Sky Palace', 'Urban Inn']
  const activities = ['Temple Tour', 'Museum Pass', 'City Walk']

  const offersData = []

  for (const route of routes) {
    for (let i = 0; i < 4; i++) {
      const depart = new Date(Date.now() + i * 86400000)
      const returnD = new Date(depart.getTime() + 5 * 86400000)

      offersData.push({
        _id: new ObjectId(),
        from: route.from,
        to: route.to,
        departDate: depart,
        returnDate: returnD,
        provider: providers[(i + route.from.charCodeAt(0)) % providers.length],
        price: 500 + Math.floor(Math.random() * 300),
        currency: 'EUR',
        legs: [{
          flightNum: `F${Math.floor(1000 + Math.random() * 9000)}`,
          dep: route.from,
          arr: route.to,
          duration: 600 + Math.floor(Math.random() * 180)
        }],
        hotel: i % 2 === 0 ? {
          name: hotels[i % hotels.length],
          nights: 4 + i,
          price: 100 + i * 20
        } : null,
        activity: i % 2 !== 0 ? {
          title: activities[i % activities.length],
          price: 50 + i * 15
        } : null
      })
    }
  }

  console.log(offersData)
  await offers.insertMany(offersData)

  const driver = getNeo4jDriver()
  const session = driver.session()

  await session.run('MATCH (n) DETACH DELETE n')

  const cities = [
    { code: 'PAR', name: 'Paris', country: 'FR', near: ['LON', 'AMS', 'BRU'] },
    { code: 'TYO', name: 'Tokyo', country: 'JP', near: ['OSA', 'NRT', 'HND'] },
    { code: 'NYC', name: 'New York', country: 'US', near: ['BOS', 'PHL', 'WDC'] },
    { code: 'LON', name: 'London', country: 'UK', near: ['MAN', 'GLA', 'DUB'] }
  ]

  for (const city of cities) {
    await session.run(
      'CREATE (c:City {code: $code, name: $name, country: $country})',
      city
    )

    for (const nearCode of city.near) {
      await session.run(
        'CREATE (n:City {code: $nearCode, name: $nearCode, country: $country})',
        { nearCode, country: city.country }
      )

      const weight = Math.random().toFixed(2)
      await session.run(
        `MATCH (a:City {code: $from}), (b:City {code: $to})
         CREATE (a)-[:NEAR {weight: toFloat($weight)}]->(b)`,
        { from: city.code, to: nearCode, weight }
      )
    }
  }

  await session.close()
  await driver.close()
}
