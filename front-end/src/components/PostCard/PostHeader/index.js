import Avatar from "components/Avatar";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import { deletePost } from "redux/actions/postAction";
import { BASE_URL } from "utils/config";
import "./PostHeader.scss";

const PostHeader = ({ post }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  //ev: user edit post
  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  //ev: User delete a post 
  const handleDeletePost = () => {
    if(window.confirm("Are you sure want to delete this post?")){
      dispatch(deletePost({post, auth, socket}))
      return history.push('/')
    }
  }

  //ev : Copy link of post
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
  }

  return (
    <div className="postheader">
      <div className="d-flex">
        <Avatar src={post.user.avatar} size="big-avatar" />

        <div className="postheader-name ml-1">
          <h6 className="m-0">
            <Link to={`/profile/${post.user._id}`} className="text-dark">
              {post.user.username}
            </Link>
          </h6>
          <small className="text-muted">
            {moment(post.createdAt).fromNow()}
          </small>
        </div>
      </div>

      <div className="nav-item dropdown">
        <span className="material-icons" id="moreLink" data-toggle="dropdown">
          more_horiz
        </span>

        <div className="dropdown-menu">
          {auth.user._id === post.user._id && (
            <>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-icons">create</span> Edit Post
              </div>
              <div className="dropdown-item" onClick={handleDeletePost}>
                <span className="material-icons">delete</span> Delete Post
              </div>
            </>
          )}

          <div className="dropdown-item" onClick={handleCopyLink}>
            <span className="material-icons">content_copy</span> Copy Link
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
