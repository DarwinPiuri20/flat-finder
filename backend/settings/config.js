const config = {
    port: 3020,
    expireTime: 60 * 60 * 1000,
    EMAIL_PASSWORD: 'cc9a7d8443a983',
    EMAIL_USER: '9e239aa6e77a1e',
    EMAIL_HOST: 'sandbox.smtp.mailtrap.io',
    EMAIL_PORT: 587,
    EMAIL_SECURE: false,
    getDbConnection: function() {
      return '';
    },
    secrets: {
      jwt: process.env.JWT || 'secret',
    }
  };
  
  module.exports = config;