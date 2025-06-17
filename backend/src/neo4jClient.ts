import neo4j from 'neo4j-driver'

export const getNeo4jDriver = () =>
  neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
  )
