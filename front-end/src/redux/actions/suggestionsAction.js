import { getDataAPI } from "utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const SUGGES_TYPES = {
  LOADING: "LOADING_SUCCESS",
  GET_USERS: "GET_USERS_SUCCESS",
};

export const getSuggestions = (token) => async (dispatch) => {
  try {
    dispatch({ type: SUGGES_TYPES.LOADING, payload: true });

    const res = await getDataAPI('suggestionsUser', token)
    dispatch({ type: SUGGES_TYPES.GET_USERS, payload: res.data})

    dispatch({ type: SUGGES_TYPES.LOADING, payload: false });

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error : err.response.data.msg},
    });
  }
};
