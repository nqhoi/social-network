import { GLOBALTYPES } from "redux/actions/globalTypes";

const socketReducer = (state = [], action) => {
  switch (action.type) {
    case GLOBALTYPES.SOCKET:
      return action.payload;
    default:
      return state;
  }
};

export default socketReducer;
