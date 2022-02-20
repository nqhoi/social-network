import { getDataAPI, patchDataAPI } from "utils/fetchData";
import { imageUpLoad } from "utils/imageUpload";
import { deleteData, GLOBALTYPES } from "./globalTypes";
import { createNotify, deleteNotify } from "./notifyAction";

export const PROFILE_TYPES = {
  LOADING: "LOADING_PROFILE",
  GET_USER: "GET_PROFILE_USER",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  GET_ID: 'GET_PROFILE_ID',
  GET_POSTS: 'GET_PROFILE_POSTS',
  UPDATE_POST: 'UPDATE_PROFILE_POST',

};

// Api: get data a user
export const getProfileUsers =({id, auth }) =>async (dispatch) => {
  dispatch({type: PROFILE_TYPES.GET_ID, payload: id})

  try {
    dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

    //api lấy dữ liệu user
    const users  = await getDataAPI(`/user/${id}`, auth.token);
    //api lấy user đã  post
    const posts = await getDataAPI(`/userposts/${id}`, auth.token);

    dispatch({
      type: PROFILE_TYPES.GET_USER,
      payload: users.data,
    });

    dispatch({
      type: PROFILE_TYPES.GET_POSTS,
      payload: {...posts.data, _id: id, page: 2},
    });

    dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

// APi update information user
export const updateProfileUser =({ userData, avatar, auth }) =>async (dispatch) => {
    if (!userData.fullname)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Please add your full name." },
      });

    if (userData.fullname.length > 25)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Your full name too long." },
      });

    if (userData.story.length > 200)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Your full name too long." },
      });

    try {
      let media;
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      if (avatar) media = await imageUpLoad([avatar]);

      const res = await patchDataAPI(
        "user",
        {
          ...userData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );

      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

// Api : handle follow user
export const Follow =({ users, user, auth, socket }) =>async (dispatch) => {
    let newUser;
    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: [...item.followers, auth.user] };
        }
      });
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: { ...auth.user, following: [...auth.user.following, newUser] },
      },
    });

    try {
      const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token);

      //  Socket
      socket.emit("follow", res.data.newUser)

      // Notify
      const msg = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      }
      
      dispatch(createNotify({ msg, auth, socket }))
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

// Api : handle unfollow user
export const UnFollow =({ users, user, auth, socket }) =>async (dispatch) => {
    let newUser = {};
    if (users.every((item) => item._id !== user._id)) {
      newUser = {
        ...user,
        followers: deleteData(user.followers, auth.user._id),
      };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: deleteData(item.followers, auth.user._id),
          };
        }
      });
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser });

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: deleteData(auth.user.following, newUser._id),
        },
      },
    });

    try {
      const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token);

      // Socket
      socket.emit("unFollow", res.data.newUser)

       // Notify
       const msg = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      }

      dispatch(deleteNotify({msg, auth, socket}))
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };
