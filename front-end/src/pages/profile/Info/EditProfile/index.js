import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import { updateProfileUser } from "redux/actions/profileAction";
import { checkImage } from "utils/imageUpload";
import "./EditProfile.scss";

const EditProfile = ({  setOnEdit }) => {
  const initialState = {
    fullname: "",
    mobile: "",
    address: "",
    website: "",
    story: "",
    gender: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { fullname, mobile, address, website, story, gender } = userData;
  const [avatar, setAvatar] = useState("");

  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileUser({ userData, avatar, auth }));
    setOnEdit(false);
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];

    //Kiểm tra ảnh có hợp lệ không ?
    const err = checkImage(file);
    if (err)
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setAvatar(file);
  };

  return (
    <div className="editprofile">
      <button
        className="btn btn-danger btn-close"
        onClick={() => setOnEdit(false)}
      >
        Close
      </button>

      <form onSubmit={handleSubmit}>
        <div className="info-avatar">
          <img
            src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
            alt="avatar"
            style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          />
          <span>
            <i className="fa fa-camera"></i>
            <p>Change</p>
            <input
              type="file"
              name="file"
              id="file_up"
              accept="image/*"
              onChange={changeAvatar}
            />
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            className="form-control"
            type="text"
            id="fullname"
            name="fullname"
            value={fullname}
            onChange={handleInput}
          />
          <small
            className="text-danger position-absolute"
            style={{
              top: "50%",
              right: "5px",
              transform: "translateY(-50%)",
            }}
          >
            {fullname.length}/25{" "}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={mobile}
            className="form-control"
            onChange={handleInput}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleInput}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            name="website"
            value={website}
            className="form-control"
            onChange={handleInput}
          />
        </div>

        <div className="form-group">
          <label htmlFor="story">Story</label>
          <textarea
            name="story"
            value={story}
            cols="30"
            rows="4"
            className="form-control"
            onChange={handleInput}
          />

          <small className="text-danger d-block text-right">
            {story.length}/200
          </small>
        </div>

        <label htmlFor="gender">Gender</label>
        <div className="input-group-prepend px-0 mb-4">
          <select
            name="gender"
            id="gender"
            value={gender}
            className="custom-select text-capitalize"
            onChange={handleInput}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button className="btn btn-info w-100" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
