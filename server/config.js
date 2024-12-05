const config = {
    APP_PRODUCTION: false,
    APP_PORT: 5000,
  
    DB_USERNAME: 'dba_pf',
    DB_PASSWORD: 'P455w0rd_pf',
    DB_DATABASE: 'alerts_cctv',
    DB_HOST: 'localhost',
    DB_DIALECT: 'mssql',
    DB_PORT: 1433,
  
    EMAIL_USER_HV: 'notificaciones.cctv@apuestatotal.net',
    EMAIL_HOST_HV: 'mail.apuestatotal.net',
    EMAIL_PASSWORD_HV: 'Admx$12345',
  
    EMAIL_USER_SAMSUNG: 'at.alertas@gmail.com',
    EMAIL_HOST_SAMSUNG: 'imap.gmail.com',
    EMAIL_PASSWORD_SAMSUNG: 'fpmpnzlvjurswmgm',
  
    EMAIL_FOLDER: 'INBOX',
    EMAIL_TLS: true,
    EMAIL_SSL: false,
  
    IMAP_PORT: 993,
  
    JWT_SECRET: 'secret',
    JWT_EXPIRES_IN: '1d',
  
    CORS_ORIGIN: ['http://prevencion.apuestatotal.at', 'http://192.168.21.35:8080', 'http://localhost:5173'],
    GIT_TOKEN: ''
  };
  
  module.exports = config;