import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const authenticate = (req, res, next) => {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ error: 'No token provided' });


const parts = authHeader.split(' ');
if (parts.length !== 2) return res.status(401).json({ error: 'Token error' });


const [scheme, token] = parts;
if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Malformed token' });


try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // contains { id, upi_id }
next();
} catch (err) {
return res.status(401).json({ error: 'Invalid token' });
}
};