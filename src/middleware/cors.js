// src/middleware/cors.js
export function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' to your domain if necessary
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
}
