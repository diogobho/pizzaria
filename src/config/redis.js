import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;
let isRedisConnected = false;

try {
  redisClient = createClient({
    url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
      connectTimeout: 5000,
      lazyConnect: true
    },
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        console.warn('⚠️  Redis server connection refused - running without Redis cache');
        return false; // Don't retry
      }
      if (options.total_retry_time > 1000 * 10) { // 10 seconds max
        return new Error('Redis retry time exhausted');
      }
      if (options.attempt > 3) {
        return undefined;
      }
      return Math.min(options.attempt * 100, 1000);
    }
  });

  redisClient.on('connect', () => {
    console.log('✅ Connected to Redis');
    isRedisConnected = true;
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️  Redis connection error - continuing without cache:', err.message);
    isRedisConnected = false;
  });

  redisClient.on('end', () => {
    console.log('Redis connection closed');
    isRedisConnected = false;
  });

  // Try to connect to Redis
  await redisClient.connect().catch((err) => {
    console.warn('⚠️  Could not connect to Redis - running without cache:', err.message);
    redisClient = null;
    isRedisConnected = false;
  });

} catch (error) {
  console.warn('⚠️  Redis initialization failed - running without cache:', error.message);
  redisClient = null;
  isRedisConnected = false;
}

// Create a safe Redis client wrapper
const safeRedisClient = {
  get: async (key) => {
    if (!redisClient || !isRedisConnected) return null;
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.warn('Redis GET error:', error.message);
      return null;
    }
  },
  
  set: async (key, value, options = {}) => {
    if (!redisClient || !isRedisConnected) return false;
    try {
      return await redisClient.set(key, value, options);
    } catch (error) {
      console.warn('Redis SET error:', error.message);
      return false;
    }
  },
  
  del: async (key) => {
    if (!redisClient || !isRedisConnected) return false;
    try {
      return await redisClient.del(key);
    } catch (error) {
      console.warn('Redis DEL error:', error.message);
      return false;
    }
  },
  
  ping: async () => {
    if (!redisClient || !isRedisConnected) throw new Error('Redis not connected');
    try {
      return await redisClient.ping();
    } catch (error) {
      throw error;
    }
  },
  
  quit: async () => {
    if (redisClient && isRedisConnected) {
      try {
        await redisClient.quit();
      } catch (error) {
        console.warn('Redis quit error:', error.message);
      }
    }
  },
  
  isConnected: () => isRedisConnected,
  client: redisClient
};

export { safeRedisClient as redisClient, isRedisConnected };
export default safeRedisClient;