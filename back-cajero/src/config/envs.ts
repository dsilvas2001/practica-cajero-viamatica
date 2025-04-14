import "dotenv/config";
import env from "env-var";
console.log(process.env.PORT);
console.log("EMAIL_HOST", process.env.EMAIL_HOST);
console.log("EMAIL_PORT", process.env.EMAIL_PORT);
console.log("FRONTEND_URL", process.env.FRONTEND_URL);

export const envs = {
  PORT: env.get("PORT").required().asPortNumber(),
  POSTGRE_PORT: env.get("POSTGRE_PORT").required().asPortNumber(),
  POSTGRE_USER: env.get("POSTGRE_USER").required().asString(),
  POSTGRE_PASS: env.get("POSTGRE_PASS").required().asString(),
  POSTGRE_HOST: env.get("POSTGRE_HOST").required().asString(),
  POSTGRE_DB_NAME: env.get("POSTGRE_DB_NAME").required().asString(),
  POSTGRE_URL: env.get("POSTGRE_URL").required().asString(),
  JWT_SEED: env.get("JWT_SEED").required().asString(),

  // Nuevas variables para email
  EMAIL_HOST: env.get("EMAIL_HOST").required().asString(),
  EMAIL_PORT: env.get("EMAIL_PORT").required().asPortNumber(),
  EMAIL_USER: env.get("EMAIL_USER").required().asString(),
  EMAIL_PASSWORD: env.get("EMAIL_PASSWORD").required().asString(),
  EMAIL_FROM: env.get("EMAIL_FROM").required().asString(),
  FRONTEND_URL: env.get("FRONTEND_URL").required().asString(),
};
