import dotenv from "dotenv";
dotenv.config();

const environtment = {
  port: process.env.PORT,
  dbUrl: process.env.MONGODB_URL,
  secret: process.env.JWT_SECRET,
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS,
};

export default environtment;
