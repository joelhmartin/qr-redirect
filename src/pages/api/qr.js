// pages/api/qr.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  let message;

  if (req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const qrs = await db.collection('qr').find({}).toArray();
    res.status(200).json({ qrs: qrs });
  }

  if (req.method === 'POST') {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const qrName = req.body.qr_name;
    const addQr = await db.collection('qr').insertOne({ qr_name: qrName });
    let qr = {};
    if (addQr.insertedId) {
      message = 'success';
      qr = {
        qr_id: addQr.insertedId,
        qr_name: qrName,
      };
    } else {
      message = 'error';
    }
    res.status(200).json({ response: { message: message, qr: qr } });
  }

  if (req.method === 'PUT') {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const qrId = req.body.qr_id;
    const qrName = req.body.qr_name;
    const updateQr = await db.collection('qr').updateOne(
      { _id: new ObjectId(qrId) },
      { $set: { qr_name: qrName } }
    );
    const result = updateQr.modifiedCount;
    if (result) {
      message = 'success';
    } else {
      message = 'error';
    }
    const qr = {
      qr_id: qrId,
      qr_name: qrName,
    };
    res.status(200).json({ response: { message: message, qr: qr } });
  }

  if (req.method === 'DELETE') {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const qrId = req.body.qr_id;
    const deleteQr = await db.collection('qr').deleteOne({ _id: new ObjectId(qrId) });
    const result = deleteQr.deletedCount;
    if (result) {
      message = 'success';
    } else {
      message = 'error';
    }
    res.status(200).json({ response: { message: message, qr_id: qrId } });
  }
}
