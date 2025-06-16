const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379
});

client.on('connect', () => {
  console.log('🔴 Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = client;