const { Router } = require("express");
const {
  getProfile,
  upsertProfile,
  getSecuritySettings,
  updateTwoFactor,
  changePassword,
} = require("../controllers/profileController");

const router = Router();
router.get("/", getProfile);
router.put("/", upsertProfile);
router.get("/security", getSecuritySettings);
router.put("/security/2fa", updateTwoFactor);
router.put("/security/password", changePassword);

module.exports = router;