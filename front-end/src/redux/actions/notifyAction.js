import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const NOTIFY_TYPES = {
  GET_NOTIFIES: "GET_NOTIFIES",
  CREATE_NOTIFY: "CREATE_NOTIFY",
  DELETE_NOTIFY: "DELETE_NOTIFY",
  UPDATE_NOTIFY: "UPDATE_NOTIFY",
  UPDATE_SOUND: "UPDATE_SOUND",
  DELETE_ALL_NOTIFIES: "DELETE_ALL_NOTIFIES",

};

export const createNotify =({ msg, auth, socket }) =>async (dispatch) => {
    try {
      const res = await postDataAPI("notify", msg, auth.token)

      // socket
      socket.emit("createNotify", {
        ...res.data.notify,
        user: {
          username: auth.user.username,
          avatar: auth.user.avatar
        }
      })

    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
};

export const deleteNotify =({ msg, auth, socket }) =>async (dispatch) => {
  try {
   await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.token)
    
     // socket
    socket.emit("deleteNotify", msg)

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

export const getNotifies = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI('notifies', token)

    dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies  })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
}

export const isReadNotifies =({msg, auth}) => async (dispatch) => {
  dispatch({ type: NOTIFY_TYPES.UPDATE_NOTIFY, payload: {...msg, isRead: true} })

  try {
    await patchDataAPI(`/isReadNotifies/${msg._id}`, null, auth.token)

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
}

export const deleteAllNotifies = (token) => async (dispatch) => {
  dispatch({ type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, payload: []})
  try {
    await deleteDataAPI(`deleteAllNotifies`, token)
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
}


