import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPost } from "redux/actions/postAction";
import LoadIcon from 'images/loading.gif';
import PostCard from "components/PostCard";

const Post = () => {
  const { id } = useParams();
  const { auth, detailPost } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [post, setPost] = useState([]);

  useEffect(() => {
    dispatch(getPost({ detailPost, id, auth }));
    if (detailPost.length > 0) {
      const newArr = detailPost.filter(post => post._id === id)
      setPost(newArr)
    }
  }, [auth, detailPost, dispatch, id]);

  return <div className="detailPost">
    {
      post.length === 0 && 
      <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4"  />
    }

    {
      post.map((item) => (
        <PostCard post={item} key={item._id} />
      ))
    }
  </div>;
};

export default Post;
