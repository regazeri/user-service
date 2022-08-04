import joi from 'joi';
/**
 * @descriptionwe use joi to validation environments variables
 */
export const validationSchema = joi
  .object({
    DB_TYPE: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().allow('').required(),
    DATABASE: joi.string().required(),
    DB_PORT: joi.number().required(),
    LOGGING: joi.boolean().required(),
    PORT: joi.number().required(),
    API_PREFIX: joi.string().required().default('v1/api'),
  })
  .unknown()
  .required();
