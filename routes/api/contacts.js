const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

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

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contactList = await listContacts();
  res.status(200).json(contactList);
});

router.get("/:contactId", async (req, res, next) => {
  const data = await getContactById(req.params.contactId);
  if (!data) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(data);
});

router.post("/", async (req, res, next) => {
  const data = req.body;
  const { error, value } = validatePostInput(data);
  if (error) {
    const obj = { message: error.message };
    res.status(400).json(obj);
  } else {
    const result = await addContact(value);
    res.status(201).json(result);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { statusRes, messageRes } = await removeContact(req.params.contactId);

  res.status(statusRes).json({ massage: messageRes });
});

router.put("/:contactId", async (req, res, next) => {
  const collectedData = { contactId: req.params.contactId, body: req.body };
  const { error, value } = validatePutInput(collectedData);
  if (error) {
    const obj = { message: error.message };
    res.status(400).json(obj);
  } else {
    const { statusRes, messageRes } = await updateContact(value);
    res.status(statusRes).json({ massage: messageRes });
  }
});

module.exports = router;
