const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  console.log('URI:', uri);
  console.log('DB Name:', dbName);

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    console.log('Connected to database:', dbName);
    // Check the collections
    const collections = await db.collections();
    console.log('Collections:', collections.map(col => col.collectionName));
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.close();
  }
}

testConnection();
