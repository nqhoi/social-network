import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Follow, UnFollow } from "redux/actions/profileAction";

const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);

  const { auth, profile, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true);
    }

    return () => setFollowed(false);
  }, [auth.user.following, user]);

  const handLeFollow = async () => {
    dispatch(Follow({ users: profile.users, user, auth, socket }));
    setFollowed(true);
  };

  const handLeUnFollow = () => {
    dispatch(UnFollow({ users: profile.users, user, auth, socket }));
    setFollowed(false);
  };

  return (
    <>
      {followed ? (
        <button className="btn btn-outline-danger" onClick={handLeUnFollow}>
          UnFollow
        </button>
      ) : (
        <button className="btn btn-outline-info" onClick={handLeFollow}>
          Follow
        </button>
      )}
    </>
  );
};

export default FollowBtn;
