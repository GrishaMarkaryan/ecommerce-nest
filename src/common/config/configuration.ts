export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  frontendUrl: process.env.FRONTEND_URL,

  mongoDbUri: process.env.MONGODB_URI,
  redisUri: process.env.REDIS_URI,
  sessionSecret: process.env.SESSION_SECRET,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    serviceSid: process.env.TWILIO_SERVICE_SID,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
})
