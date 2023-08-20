const fs = require("fs/promises");

const uuid = require("uuid").v4;
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

async function readDB() {
  try {
    const rawData = await fs.readFile(contactsPath);
    // return rawData.toString();
    const parsedcontactList = JSON.parse(rawData.toString());
    return parsedcontactList;
  } catch (error) {
    console.log("error when read DB", error);
  }
}

async function writeDB(arr) {
  try {
    const writeNewArr = await fs.writeFile(contactsPath, JSON.stringify(arr));
    return true;
  } catch (error) {
    console.log("error when write DB", error);
  }
}

const listContacts = async () => {
  return readDB();
};

const getContactById = async (contactId) => {
  const contactList = await readDB();

  return contactList.find((item) => item.id === contactId);
};

const removeContact = async (contactId) => {
  const contactList = await readDB();

  const newData = contactList.filter((value, index, array) => {
    return value.id !== contactId;
  });
  if (contactList.length - newData.length === 0) {
    return { messageRes: "Not found", statusRes: 404 };
  }
  const result = await writeDB(newData);

  if (!result) {
    return "error when write DB";
  }
  return { messageRes: "contact deleted", statusRes: 200 };
};

const addContact = async (body) => {
  try {
    body.id = uuid();

    const contactList = await readDB();

    contactList.push(body);

    const result = await writeDB(contactList);

    if (!result) {
      return "error when write DB";
    }
    return body;
  } catch (error) {
    console.log("error when write DB", error);
  }
};

const updateContact = async ({ contactId, body }) => {
  try {
    const contactList = await readDB();

    const oldContactById = contactList.find((obj) => obj.id === contactId);
    if (!oldContactById) {
      return { messageRes: "Not found", statusRes: 404 };
    }
    const { name, email, phone } = body;
    const mergedContact = { id: contactId };
    if (!name) {
      mergedContact.name = oldContactById.name;
    } else {
      mergedContact.name = name;
    }
    if (!email) {
      mergedContact.email = oldContactById.email;
    } else {
      mergedContact.email = email;
    }

    if (!phone) {
      mergedContact.phone = oldContactById.phone;
    } else {
      mergedContact.phone = phone;
    }
    console.log("newContact is:", mergedContact);

    const newContactList = contactList.map((obj) => {
      if (obj.id === contactId) {
        return mergedContact;
      } else {
        return obj;
      }
    });
    const result = await writeDB(newContactList);
    if (!result) {
      return "error when saving to db";
    }
    return { messageRes: "contact updated", statusRes: 200 };
  } catch (error) {
    console.log("error when update contact", error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
