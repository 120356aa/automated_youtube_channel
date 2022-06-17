import dotenv from 'dotenv'
dotenv.config()

export const auth = {
  userAgent: 'script:youtube.automation.script:v1.0.0 (by /u/Ssn0wTheMiz)',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.CLIENT_USER,
  password: process.env.CLIENT_PASS,
}

