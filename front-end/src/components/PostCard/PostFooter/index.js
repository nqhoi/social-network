import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Send from "images/send.svg";
import "./PostFooter.scss";
import LikeButton from "components/LikeButton";
import { useDispatch, useSelector } from "react-redux";
import { likePost, savePost, unLikePost, unSavePost } from "redux/actions/postAction";
import ShareModal from "components/ShareModal";
import { BASE_URL } from "utils/config";

const PostFooter = ({ post }) => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadSave, setLoadSave] = useState(false);

  // like or unlike 
  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    }else {
      setIsLike(false);
    }
  }, [auth.user._id, post.likes]);

  // save a post
  useEffect(() => {
    if(auth.user.saved.find(id=> id === post._id)) {
      setSaved(true)
    }else{
      setSaved(false)
    }
  },[auth.user.saved, post._id])

  // ev: Like a post
  const handleLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  //ev : Unlike a post
  const handleUnLike = async () => {
    if (loadLike) return;

    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleSavePost = async () => {
    if (loadSave) return;

    setLoadSave(true);
    await dispatch(savePost({ post, auth }));
    setLoadSave(false);
  };

  //ev : Unlike a post
  const handleUnSavePost = async () => {
    if (loadSave) return;

    setLoadSave(true);
    await dispatch(unSavePost({ post, auth }));
    setLoadSave(false);
  };

  return (
    <div className="postfooter">
      <div className="postfooter-menu">
        <div className="">
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />

          <Link to={`/post/${post.id}`} className="text-dark">
            <i className="far fa-comment"></i>
          </Link>

          <img src={Send} alt="send" onClick={() => setIsShare(!isShare)} />
        </div>

        {/* Save a post  */}
        {saved ? (
          <i className="fas fa-bookmark text-info"
          onClick={handleUnSavePost}
          />
        ) : (
          <i className="far fa-bookmark" 
          onClick={handleSavePost}
          />
        )}

      </div>
      <div className="d-flex justify-content-between">
        <h6 style={{ padding: "0 24px", cursor: "pointer" }}>
          {post.likes.length}
        </h6>
        <h6 style={{ padding: "0 24px", cursor: "pointer" }}>
          {post.comments.length} Comments
        </h6>
      </div>

      {/* share a post */}
      {isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />}
    </div>
  );
};

export default PostFooter;
