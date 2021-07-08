"use strict";
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = {
    appName: process.env.APP_NAME || 'Team Manager',
    environment: process.env.NODE_ENV || 'development',
    apiHost: `http://localhost:${PORT}`,
    baseUrl: `http://localhost:${PORT}`,
    port: PORT,
};
const databases = {
    mongodb: {
        test: process.env.DB_TEST_URL,
    },
};
const api = {
    url: process.env.SERVICE_URL || 'http://127.0.0.1:8000/api/v1',
    lang: 'en',
    prefix: '^/v[1-9]',
    versions: [1],
    pagination: {
        itemsPerPage: 10,
    },
};
const email = {
    mailOption: 'sendgrid',
    from: process.env.EMAIL_NO_REPLY,
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        contactFormRecipient: process.env.CONTACT_FORM_EMAIL_RECIPIENT
    },
    mailgun: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
};
module.exports = {
    app,
    databases,
    api,
    email
};
