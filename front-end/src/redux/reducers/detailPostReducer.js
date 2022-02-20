import { editData } from "redux/actions/globalTypes";
import { POST_TPYES } from "redux/actions/postAction";

const detailPostReducer = (state = [], action) => {
  switch (action.type) {
    case POST_TPYES.GET_POST:
      return [...state, action.payload];
    case POST_TPYES.UPDATE_POST:
      return editData(state, action.payload._id, action.payload);
    default:
      return state;
  }
};

export default detailPostReducer;
