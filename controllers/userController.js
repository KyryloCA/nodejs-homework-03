const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../controllers/databaseInteraction");
const {
  validatePostInput,
  validatePutInput,
} = require("../utilities/inputValidation");

const { catchAsync } = require("../utilities/catchAsync");
const CustomError = require("../utilities/CustomError");

// The regular way to catch error

const getAllContacts = async (req, res, next) => {
  try {
    const contactList = await listContacts();
    res.status(200).json(contactList);
  } catch (err) {
    next(err);
  }
};

// Using catchAsync method

const addOneContact = catchAsync(async (req, res, next) => {
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

// longer way:

// const getOneContactById = catchAsync(async (req, res, next) => {
//   const data = await getContactById(req.params.contactId);
//   if (!data) {
//     res.status(404).json({ message: "Not found" });
//     return;
//   }
//   res.json(data);
// });

// shorter way:

const getOneContactById = catchAsync(async (req, res, next) => {
  const data = await getContactById(req.params.contactId);
  if (!data) throw new CustomError(404, "Not found");
  res.json(data);
});

// catchAsync + CustomError approach

const updateOneContactById = catchAsync(async (req, res, next) => {
  const collectedData = { contactId: req.params.contactId, body: req.body };

  const { error, value } = validatePutInput(collectedData);

  if (error) throw new CustomError(400, error.message);

  const { statusRes, messageRes } = await updateContact(value);
  res.status(statusRes).json({ massage: messageRes });
});

const deleteOneContactById = catchAsync(async (req, res, next) => {
  const { statusRes, messageRes } = await removeContact(req.params.contactId);

  res.status(statusRes).json({ massage: messageRes });
});
module.exports = {
  getAllContacts,
  addOneContact,
  getOneContactById,
  updateOneContactById,
  deleteOneContactById,
};
