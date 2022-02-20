import PostThumb from "components/PostThumb";
import React, { useEffect, useState } from "react";
import LoadIcon from "images/loading.gif";
import LoadMoreBtn from "components/LoadMoreBtn";
import { getDataAPI } from "utils/fetchData";
import { PROFILE_TYPES } from "redux/actions/profileAction";

const ProfilePosts = ({auth, id, dispatch, profile}) => {

  const [posts, setPosts] = useState([])
  const [result, setResult] = useState(9)
  const [page, setPage] = useState(0)
  const [load, setLoad] = useState(false)

  //:
  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data._id === id) {
        setPosts(data.posts);
        setResult(data.result);
        setPage(data.page);
      }
    });
  }, [profile.posts, id]);

  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataAPI(`userposts/${id}?limit=${page * 9}`, auth.token)
    const newData = {...res.data, page: page + 1, _id: id}
    dispatch({type: PROFILE_TYPES.UPDATE_POST, payload: newData})
    setLoad(false)
}

  return (
    <div>
      <PostThumb posts={posts} result={result} />

      {load && (
        <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
      )}

      <LoadMoreBtn
        result={result}
        page={page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default ProfilePosts;
