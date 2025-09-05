module.exports = {
  apps: [{
    name: 'pizzaria-rodrigos',
    script: 'server.js',
    cwd: '/var/www/apps/pizzaria',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/www/logs/pizzaria/error.log',
    out_file: '/var/www/logs/pizzaria/out.log',
    log_file: '/var/www/logs/pizzaria/combined.log',
    time: true
  }]
};
