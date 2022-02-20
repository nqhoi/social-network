import LoadMoreBtn from "components/LoadMoreBtn";
import PostThumb from "components/PostThumb";
import LoadIcon from "images/loading.gif";
import React, { useEffect, useState } from "react";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import { getDataAPI } from "utils/fetchData";

const ProfileSaved = ({ auth, dispatch}) => {

  const [savePosts, setSavePosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(2);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    getDataAPI("getsaveposts", auth.token)
      .then((res) => {
        setSavePosts(res.data.savePosts);
        setResult(res.data.result);
        setLoad(false);
      })
      .catch((err) => {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: err.response.data.msg },
        });
      });

    return () => setSavePosts([]);
  }, [auth.token, dispatch]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(`getsaveposts?limit=${page * 9}`, auth.token);
    setSavePosts(res.data.savePosts);
    setResult(res.data.result);
    setPage(page + 1);
    setLoad(false);
  };

  return (
    <div>
      <PostThumb posts={savePosts} result={result} />

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

export default ProfileSaved;
