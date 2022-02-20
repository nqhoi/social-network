import PostCard from "components/PostCard";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Posts.scss";
import LoadIcon from "images/loading.gif";
import LoadMoreBtn from "components/LoadMoreBtn";
import { getDataAPI } from "utils/fetchData";
import { POST_TPYES } from "redux/actions/postAction";


const Posts = () => {
  const { homePosts, auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);


  const handleLoadMore = async ( ) => {
    setLoad(true);
    const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token)

    dispatch({
      type: POST_TPYES.GET_POSTS,
      payload: {...res.data, page: homePosts.page + 1}
    })
    setLoad(false);
  }

  return (
    <div className="posts">
      {homePosts.posts.map((post) => (
        <PostCard key={post._id} post={post}  />
      ))}

      {load && (
        <img src={LoadIcon} alt="loading" className="d-block mx-auto " />
      )}

      <LoadMoreBtn
        result={homePosts.result}
        page={homePosts.page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default Posts;
