import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import offers from './offers.js'
import { login } from './session.js'
import { reco } from './reco.js'
import { seedData } from './seed.js'

const app = new Hono()

app.use('*', cors())

app.route('/offers', offers)
app.route('/login', login)
app.route('/reco', reco)

// seed route temporaire
app.get('/seed', async (c) => {
  await seedData()
  return c.text("Données insérées.")
})

serve({ fetch: app.fetch, port: 3000 })
