import * as Joi from 'joi';

/**
 * Environment variables schema for validation.
 * @see https://joi.dev/api/?v=17.9.1
 * @description This schema is used to validate the environment variables.
 * @type {Joi.ObjectSchema}
 */
export const ValidationEnvSchema: Joi.ObjectSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().default('development'),

  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
});
