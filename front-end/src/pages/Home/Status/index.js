import Avatar from "components/Avatar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import "./Status.scss";

const Status = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div className="status my-3 d-flex">
      <Avatar src={auth.user.avatar} size="big-avatar" />
      <button
        className="status-btn flex-fill"
        onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
      >
        {auth.user.username}, What are you doing?
      </button>
    </div>
  );
};

export default Status;
