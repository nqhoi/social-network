import { GLOBALTYPES } from "redux/actions/globalTypes";

const initialState = false;

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.STATUS:
      return action.payload;

    default:
      return state;
  }
};

export default statusReducer;
