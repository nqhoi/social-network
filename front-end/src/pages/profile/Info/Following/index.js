import UserCard from "components/UserCard";
import React from "react";
import { useSelector } from "react-redux";
import FollowBtn from "components/FollowBtn";

const Following = ({ users, setShowFollowing }) => {
  const { auth } = useSelector((state) => state);

  return (
    <div className="followers">
      <div className="followers-box">
        <h5 className="text-center mt-3">Following</h5>
        <hr />

        <div className="followers-content">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              setShowFollowing={setShowFollowing}
            >
              {auth.user._id !== user._id && <FollowBtn user={user} />}
            </UserCard>
          ))}
        </div>

        <div
          className="followers-close"
          onClick={() => setShowFollowing(false)}
        >
          &times;
        </div>
      </div>
    </div>
  );
};

export default Following;
