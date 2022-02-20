import Loading from "components/Loading";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import Toast from "../Toast";

const Alert = () => {
  const { alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div>
      {alert.loading && <Loading />}

      {alert.error && (
        <Toast
          msg={{ title: "Error", body: alert.error }}
          handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
          bgColor="bg-danger"
        />
      )}

      {alert.success && (
        <Toast
          msg={{ title: "Success", body: alert.success }}
          handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
          bgColor="bg-success"
        />
      )}
    </div>
  );
};

export default Alert;
