import { getHello } from './route';

export default function handler(req, res) {
  if (req.method === 'GET') {
    getHello(req, res);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}