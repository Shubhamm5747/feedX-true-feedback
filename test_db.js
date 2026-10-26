const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log("URI from env:", process.env.MONGODB_URI);
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    const db = client.db("Youtube");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

testConnection();
