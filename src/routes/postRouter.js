const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router.route("/posts")
  .post(auth, postCtrl.createPost)
  .get(auth, postCtrl.getPosts);

router.route('/post/:id')
  .get(auth, postCtrl.getPost)
  .patch(auth, postCtrl.updatePost)
  .delete(auth, postCtrl.deletePost)

router.patch('/post/:id/like', auth, postCtrl.likePost)
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost)

router.get('/userposts/:id', auth, postCtrl.getUserPosts)

router.get('/post_discover', auth, postCtrl.getPostsDicover)

router.patch('/savepost/:id', auth, postCtrl.savePost)
router.patch('/unsavepost/:id', auth, postCtrl.unSavePost)

router.get('/getsaveposts', auth, postCtrl.getSavePosts)



module.exports = router;
