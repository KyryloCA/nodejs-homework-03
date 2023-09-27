const express = require("express");

const {
  getAllContacts,
  addOneContact,
  getOneContactById,
  updateOneContactById,
  deleteOneContactById,
} = require("../../controllers/userController");

const router = express.Router();

router.route("/").get(getAllContacts).post(addOneContact);
router
  .route("/:contactId")
  .get(getOneContactById)
  .put(updateOneContactById)
  .delete(deleteOneContactById);
module.exports = router;
