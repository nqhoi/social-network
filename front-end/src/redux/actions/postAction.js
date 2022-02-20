import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "utils/fetchData";
import { imageUpLoad } from "utils/imageUpload";
import { GLOBALTYPES } from "./globalTypes";
import { createNotify, deleteNotify } from "./notifyAction";

export const POST_TPYES = {
  CREATE_POST: "CREATE_POST",
  LOADING_POST: "LOADING_POST",
  GET_POSTS: "GET_POSTS",
  UPDATE_POST: "UPDATE_POST",
  GET_POST: 'GET_POST',
  DELETE_POST: 'DELETE_POST'
};

//Api đăng status
export const createPost =({ content, images, auth, socket }) =>async (dispatch) => {
    let media = [];
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      if (images.length > 0) media = await imageUpLoad(images);

      const res = await postDataAPI("posts", { content, images: media }, auth.token);

      dispatch({
        type: POST_TPYES.CREATE_POST,
        payload: { ...res.data.newPost, user: auth.user },
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });

      // Notify
      const msg = {
        id: res.data.newPost._id,
        text: "added a new post.",
        recipients: res.data.newPost.user.followers,
        url: `/post/${res.data.newPost._id}`,
        content, 
        image: media[0].url,
      }

      dispatch(createNotify({msg, auth, socket}))
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
};

// Api Lấy các bài đăng trong friend và chính mình
export const getPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: POST_TPYES.LOADING_POST, payload: true });
    const res = await getDataAPI("posts", token);

    dispatch({
      type: POST_TPYES.GET_POSTS,
      payload: { ...res.data, page: 2 },
    });

    dispatch({ type: POST_TPYES.LOADING_POST, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};


//Api Cập nhập bài đăng 
export const updatePost =({ content, images, auth, status }) =>async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter((img) => !img.url);
    const imgOldUrl = images.filter((img) => img.url);

    if (
      status.content === content &&
      imgNewUrl.length === 0 &&
      imgOldUrl.length === status.images.length
    ) return;
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (imgNewUrl.length > 0) media = await imageUpLoad(imgNewUrl);

      const res = await patchDataAPI(`post/${status._id}`,{
          content,
          images: [...imgOldUrl, ...media],
        },auth.token);

      dispatch({ type: POST_TPYES.UPDATE_POST, payload: res.data.newPost });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
};

export const likePost = ({post, auth, socket}) => async (dispatch) => {
  const newPost = {...post, likes: [...post.likes, auth.user]}
  dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost });

  // Socket
  socket.emit("likePost", newPost )

  try {
    await patchDataAPI(`post/${post._id}/like`, null, auth.token)

     // Notify
     const msg = {
      id: auth.user._id,
      text: "Like your post.",
      recipients: [post.user._id],
      url: `/post/${post._id}`,
      content: post.content, 
      image: post.images[0].url,
    }

    dispatch(createNotify({msg, auth, socket}))
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
  
}

export const unLikePost = ({post, auth, socket}) => async (dispatch) => {
  const newPost = {...post, likes: post.likes.filter(
    like => like._id !== auth.user._id)
  }
  dispatch({ type: POST_TPYES.UPDATE_POST, payload: newPost });

  // Socket
  socket.emit('unLikePost', newPost);

  try {
    await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

    // Notify
    const msg = {
      id: auth.user._id,
      text: "Like your post.",
      recipients: [post.user._id],
      url: `/post/${post._id}`,
    }

    dispatch(deleteNotify({msg, auth, socket}))
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
  
}

// api: lấy 1 bài post 
export const getPost = ({detailPost, id, auth}) => async dispatch => {
  if(detailPost.every(post => post._id !== id)) {
    try {
      const res = await getDataAPI(`post/${id}`, auth.token)

      dispatch({ type: POST_TPYES.GET_POST, payload: res.data.post})
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg}
      })
    }
  }
}

// api: user delete a post
export const deletePost =({post, auth, socket}) => async (dispatch) => {
  dispatch({ type: POST_TPYES.DELETE_POST, payload: post})

  try {
    const res = await deleteDataAPI(`post/${post._id}`, auth.token)
    
    // Notify
    const msg = {
      id: post._id,
      text: "added a new post.",
      recipients: res.data.newPost.user.followers,
      url: `/post/${post._id}`,
    }

    dispatch(deleteNotify({msg, auth, socket}))
  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: {error: err.response.data.msg}
    })
  }
}

// api : save a post
export const savePost = ({post, auth}) => async (dispatch) => {
  const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
  dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser} })

  try {
    await patchDataAPI(`savepost/${post._id}`, null, auth.token)
  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: {error: err.response.data.msg}
    })
  }
}

// api : unSave a post
export const unSavePost = ({post, auth}) => async (dispatch) => {
  const newUser = {
    ...auth.user, 
    saved: [...auth.user.saved.filter(id=> id !== post._id)]
  }
  dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser} })

  try {
    await patchDataAPI(`unsavepost/${post._id}`, null, auth.token)
  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: {error: err.response.data.msg}
    })
  }
}

// api: get post saved
export const getSavePosts =  () => async (dispatch) => {
  
}