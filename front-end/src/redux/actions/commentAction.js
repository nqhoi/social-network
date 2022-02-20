import { deleteDataAPI, patchDataAPI, postDataAPI } from "utils/fetchData";
import { deleteData, editData, GLOBALTYPES } from "./globalTypes";
import { createNotify, deleteNotify } from "./notifyAction";
import { POST_TPYES } from "./postAction";


//api : User thực hiện comment
export const createComment =({ post, newComment, auth, socket }) =>async (dispatch) => {
    const newPost = { ...post, commnets: [...post.comments, newComment] };

    dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost });

    try {
      const data = { ...newComment, postId: post._id, postUserId: post.user._id };
      const res = await postDataAPI("comment", data, auth.token);

      const newData = { ...res.data.newComment, user: auth.user };
      const newPost = { ...post, comments: [...post.comments, newData] };

      dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost });

      // Socket
      socket.emit("createComment", newPost)

      // Notify
      const msg = {
        id: res.data.newComment._id,
        text: newComment.reply ? "mentioned you in a comment." : "has commented on your post.",
        recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
        url: `/post/${post._id}`,
        content: post.content, 
        image: post.images[0].url,
      }

      dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

//api: user sửa đổi comment
export const updateComment = ({comment,  post, content , auth}) =>  async (dispatch) => {
  const newComment = editData(post.comments, comment._id, {...comment, content})
  const newPost = {...post, comments: newComment}

  dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost})

  try {
    patchDataAPI(`comment/${comment._id}`, {content}, auth.token)
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
}  

//api: like comment
export const likeComment = ({comment, post, auth}) => async (dispatch) => {
  const newComment = {...comment, likes: [...comment.likes, auth.user]}

  const newComments = editData(post.comments, comment._id, newComment)
  const newPost = {...post, comments: newComments}
  
  dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost})
  
  try {
    await patchDataAPI(`comment/${comment._id}/like`, null, auth.token)
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
}

//api: unlike comment
export const unLikeComment = ({comment, post, auth}) => async (dispatch) => {
  const newComment = {...comment, likes: deleteData(comment.likes, auth.user._id)}

  const newComments = editData(post.comments, comment._id, newComment)
  const newPost = {...post, comments: newComments}
  
  dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost})
    await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token)
  try {
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
}

export const deleteComment = ({post, auth, comment, socket}) => async (dispatch) => {
  const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment]

  const newPost = {
    ...post,
    comments: post.comments.filter(cm => !deleteArr.find(da => cm._id === da._id))
  }

  dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost})

  // Socket
  socket.emit('deleteComment', newPost)

  try {
    deleteArr.forEach(item =>{
      deleteDataAPI(`comment/${item._id}`, auth.token)

        // Notify
        const msg = {
          id: item._id,
          text: comment.reply ? "mentioned you in a comment." : "has commented on your post.",
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `/post/${post._id}`,
        }
  
        dispatch(deleteNotify({ msg, auth, socket }))
    })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
}
