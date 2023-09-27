const Joi = require("joi");

const postSchema = Joi.object({
  name: Joi.string().required().error(new Error("Missing required name field")),
  email: Joi.string()
    .email()
    .required()
    .error(new Error("Missing required email field")),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .error(new Error("Missing required phone field")),
});

const putSchema = Joi.object({
  contactId: Joi.string()
    .required()
    .error(new Error("Missing required id field")),
  body: Joi.object().required().error(new Error("Missing required body field")),
});

function validatePostInput(data) {
  return postSchema.validate(data);
}

function validatePutInput(data) {
  return putSchema.validate(data);
}

module.exports = { validatePostInput, validatePutInput };
