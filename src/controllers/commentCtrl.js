const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");

const commentCtrl = {
  //Api: User thực hiện comment
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body;

      const post = await Posts.findById(postId);
      if(!post) return res.status(400).json({msg: "This Post dose not exist."})

      if(reply) {
        const cm = await Comments.findById(reply)
        if(!cm) return res.status(400).json({msg: "This Comment dose not exist."})
      }

      const newComment = new Comments({
        user: req.user._id, content, tag, reply, postUserId, postId
      });

      await Posts.findByIdAndUpdate({ _id: postId },{
        $push: { comments: newComment._id },
      },{ new: true });

      await newComment.save();

      res.json({ newComment });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  //api : User sửa đổi comment
  updateComment : async (req, res) => {
    try {
      const {content} = req.body;

      await Comments.findOneAndUpdate({
        _id: req.params.id, user: req.user._id
      }, {content})

      res.json({msg: "Update Success."})
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  //api Like comment
  likeComment: async (req, res) => {
    try {
      const comment = await Comments.find({_id: req.params.id, likes: req.user._id})
      if(comment.length >0) return res.status(400).json({msg: "You liked this comment."})

      await Comments.findByIdAndUpdate({_id: req.params.id}, {
        $push: {likes: req.user._id}
      }, {new: true})

      res.json({msg: "Liked Comment."})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //api UnLike comment
  unLikeComment: async (req, res) => {
    try {
      await Comments.findByIdAndUpdate({_id: req.params.id}, {
        $pull: {likes: req.user._id}
      }, {new: true})

      res.json({msg: "UnLiked Comment."})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //api: delete comment
  deleteComment: async (req, res) => {
    try {
      const comment = await Comments.findOneAndDelete({
        _id: req.params.id,
        $or: [
          { user: req.user._id },
          { postUserId: req.user._id }
        ]
      })

      await Posts.findOneAndUpdate({_id: comment.postId}, {
        $pull: { comments: req.params.id}
      })

      return res.json({msg: "Deleted Comment."})
      
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

};

module.exports = commentCtrl
