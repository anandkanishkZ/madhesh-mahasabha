module.exports = {
  apps: [
    {
      name: 'madhesh-backend',
      script: 'dist/index.js',
      cwd: '/home/zwicky/madhesh-mahasabha/backend',
      instances: 1,
      exec_mode: 'fork',  // Changed from 'cluster' to 'fork'
      env_production: {
        NODE_ENV: 'production',
        PORT: 6000
      },
      error_file: 'logs/backend-error.log',
      out_file: 'logs/backend-out.log',
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
      exec_mode: 'fork',  // Changed to 'fork' for consistency
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      error_file: 'logs/frontend-error.log',
      out_file: 'logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '800M',
      watch: false,
      merge_logs: true,
      time: true
    }
  ]
};