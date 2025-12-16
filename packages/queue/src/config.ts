import { ConnectionOptions } from 'bullmq';

/**
 * Get Redis connection configuration
 */
export function getRedisConnection(): ConnectionOptions {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    // Parse Redis URL (redis://[username[:password]@]host:port or rediss://...)
    const url = new URL(redisUrl);
    const config: ConnectionOptions = {
      host: url.hostname,
      port: parseInt(url.port || '6379'),
      maxRetriesPerRequest: null, // Required for BullMQ
    };

    // Extract username from URL if present
    if (url.username) {
      config.username = decodeURIComponent(url.username);
    }

    // Extract password from URL if present
    if (url.password) {
      config.password = decodeURIComponent(url.password);
    }

    // Support TLS for rediss:// URLs
    if (url.protocol === 'rediss:') {
      config.tls = {};
    }

    return config;
  }

  // Fallback to individual env vars
  const config: ConnectionOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
  };

  // Add username if provided
  if (process.env.REDIS_USERNAME) {
    config.username = process.env.REDIS_USERNAME;
  }

  // Add password if provided
  if (process.env.REDIS_PASSWORD) {
    config.password = process.env.REDIS_PASSWORD;
  }

  return config;
}
