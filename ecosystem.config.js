module.exports = {
  apps: [
    {
      name: 'madhesh-backend',
      script: './backend/dist/index.js',
      cwd: '/home/zwicky/madhesh-mahasabha/backend',
      instances: 2,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '500M',
      watch: false,
      merge_logs: true,
      time: true
    },
    {
      name: 'madhesh-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/zwicky/madhesh-mahasabha/frontend',
      instances: 1,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '800M',
      watch: false,
      merge_logs: true,
      time: true
    }
  ]
};