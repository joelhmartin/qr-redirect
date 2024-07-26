// src/pages/api/qr.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

async function handler(req, res) {
  let message;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    if (req.method === 'GET') {
      const qrs = await db.collection('qr').find({}).toArray();
      res.status(200).json({ qrs });
    }

    if (req.method === 'POST') {
      const { name, URL } = req.body;
      const addQr = await db.collection('qr').insertOne({ name, URL });
      let qr = {};
      if (addQr.insertedId) {
        message = 'success';
        qr = {
          _id: addQr.insertedId,
          name,
          URL,
        };
      } else {
        message = 'error';
      }
      res.status(200).json({ response: { message, qr } });
    }

    if (req.method === 'PUT') {
      const { _id, name, URL } = req.body;
      const updateQr = await db.collection('qr').updateOne(
        { _id: new ObjectId(_id) },
        { $set: { name, URL } }
      );
      const result = updateQr.modifiedCount;
      if (result) {
        message = 'success';
      } else {
        message = 'error';
      }
      const qr = {
        _id,
        name,
        URL,
      };
      res.status(200).json({ response: { message, qr } });
    }

    if (req.method === 'DELETE') {
      const { _id } = req.body;
      const deleteQr = await db.collection('qr').deleteOne({ _id: new ObjectId(_id) });
      const result = deleteQr.deletedCount;
      if (result) {
        message = 'success';
      } else {
        message = 'error';
      }
      res.status(200).json({ response: { message, _id } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default allowCors(handler);
