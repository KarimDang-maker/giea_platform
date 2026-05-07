const { default: Redis } = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
});

// Empêche le plantage brutal de l'application si Redis n'est pas lancé
redis.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        console.error('Impossible de se connecter à Redis. Vérifiez que le serveur Redis est lancé sur le port 6379.');
    } else {
        console.error('Erreur Redis:', err.message);
    }
});

module.exports = redis;