import { deleteData, editData } from "redux/actions/globalTypes";

const { POST_TPYES } = require("redux/actions/postAction");

const initialState = {
  loading: false,
  posts: [],
  result: 0,
  page: 2,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TPYES.LOADING_POST:
      return {
        ...state,
        loading: action.payload,
      };
    case POST_TPYES.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };

    case POST_TPYES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        page: action.payload.page,
      };
    case POST_TPYES.UPDATE_POST:
      return {
        ...state,
        posts: editData(state.posts, action.payload._id, action.payload),
      };
    case POST_TPYES.DELETE_POST:
      return {
        ...state,
        posts: deleteData(state.posts, action.payload._id),
      };
    default:
      return state;
  }
};

export default postReducer;
