// src/pages/api/qr.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cors } from '@/middleware/cors';

export default async function handler(req, res) {
  cors(req, res, async () => {
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
  });
}
