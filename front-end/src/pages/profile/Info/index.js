import Avatar from "components/Avatar";
import React, { useEffect, useState } from "react";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import FollowBtn from "../../../components/FollowBtn";
import EditProfile from "./EditProfile";
import Followers from "./Followers";
import Following from "./Following";
import "./Info.scss";

const Info = ({ id, auth, profile, dispatch}) => {

  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [id, auth, dispatch, profile.users]);

  useEffect(() => {
    if (showFollowers || showFollowing || onEdit) {
      dispatch({ type: GLOBALTYPES.MODAL, payload: true });
    } else {
      dispatch({ type: GLOBALTYPES.MODAL, payload: false });
    }
  }, [showFollowers, showFollowing, onEdit, dispatch]);

  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info-container" key={user._id}>
          <Avatar src={user.avatar} size="supper-avatar" />

          <div className="info-content">
            <div className="info-content-title">
              <h2>{user.username}</h2>
              {user._id === auth.user._id ? (
                <button
                  className="btn btn-outline-info"
                  onClick={() => setOnEdit(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <FollowBtn user={user} />
              )}
            </div>

            <div className="follow-btn">
              <span className="mr-4" onClick={() => setShowFollowers(true)}>
                {user.followers.length} Followers
              </span>

              <span className="ml-4" onClick={() => setShowFollowing(true)}>
                {user.following.length} Following
              </span>
            </div>

            <h6>
              {user.fullname} <span className="text-danger">{user.mobile}</span>
            </h6>
            <p className="m-0">{user.address}</p>
            <p className="m-0">{user.email}</p>
            <a href={user.website} target="_blank">
              {user.website}
            </a>
            <p>{user.story}</p>
          </div>
          {onEdit && <EditProfile user={user} setOnEdit={setOnEdit} />}
          {showFollowers && (
            <Followers
              users={user.followers}
              setShowFollowers={setShowFollowers}
            />
          )}
          {showFollowing && (
            <Following
              users={user.following}
              setShowFollowing={setShowFollowing}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Info;
