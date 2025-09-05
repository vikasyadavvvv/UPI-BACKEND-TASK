import rateLimit from 'express-rate-limit';


// General rate limiter (tweak limits as needed)
const limiter = rateLimit({
windowMs: 1 * 60 * 1000, // 1 minute
max: 100, // limit each IP to 100 requests per windowMs
standardHeaders: true,
legacyHeaders: false
});


export default limiter;