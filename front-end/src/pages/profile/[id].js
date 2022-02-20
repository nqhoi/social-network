import Info from "pages/profile/Info";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import loadIcon from "images/loading.gif";
import { getProfileUsers } from "redux/actions/profileAction";
import { useParams } from "react-router-dom";
import ProfilePosts from "./ProfilePosts";
import './Profile.scss'
import ProfileSaved from "./ProfileSaved";

const Profile = () => {
  const { auth, profile } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [saveTab, setSaveTab] = useState(false)

  // Lấy dữ liệu user
  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [dispatch, auth, id, profile.ids]);

  return (
    <div className="profile">
      {/* Thông tin user */}
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

      {/* Save Tab */}
      {
        auth.user._id === id && 
        <div className="profile-tab">
          <button className={saveTab ? "" : "active"} onClick={() => setSaveTab(false)} >Posts</button>
          <button className={saveTab ? "active" : ""} onClick={() => setSaveTab(true)} >Saved</button>
        </div>
      }

      {/* Bài post của user */}
      {profile.loading ? (
        <img className="d-block mx-auto my-4" src={loadIcon} alt="Loading" />
      ) : (
        <>
          {saveTab ? 
            <ProfileSaved auth={auth} dispatch={dispatch} /> :
            <ProfilePosts auth={auth} profile={profile} dispatch={dispatch} id={id} />
          }
        </>
      )}
    </div>
  );
};

export default Profile;
