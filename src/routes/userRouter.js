const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

router.get("/search", auth, userCtrl.searchUser);

router.get("/user/:id", auth, userCtrl.getuser);

router.patch("/user/", auth, userCtrl.updateUser);

router.patch("/user/:id/follow", auth, userCtrl.follow);

router.patch("/user/:id/unfollow", auth, userCtrl.unFollow);

router.get("/suggestionsUser", auth, userCtrl.suggestionsUser);




module.exports = router;