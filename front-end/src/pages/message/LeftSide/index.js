import UserCard from "components/UserCard";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import { getConversations, MESS_TYPES } from "redux/actions/messageAction";
import { getDataAPI } from "utils/fetchData";
import "./style.scss";

const LeftSide = () => {
  const { auth, message, online } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");
  const [searchUsers, setSerachUsers] = useState([]);

  // Event: Tìm kiếm bạn bè
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return setSerachUsers([]);

    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setSerachUsers(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

  const handleAddUser = (user) => {
    setSearch("");
    setSerachUsers([]);
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
    dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
    return history.push(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return "active";
    return "";
  };

  //
  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ auth }));
  }, [dispatch, auth, message.firstLoad]);

  //Load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(pageEnd.current);
  }, [setPage]);

  //
  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }));
    }
  }, [message.resultUsers, page, dispatch, auth]);

  // Check User Online - offline
  useEffect(() => {
    if (message.firstLoad)
      dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
  }, [message.firstLoad, dispatch, online]);

  return (
    <>
      <form className="message_header" onClick={handleSearch}>
        <input
          type="text"
          placeholder="Enter to Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="d-none">
          Search
        </button>
      </form>

      <div className="message_chatlist">
        {searchUsers.length !== 0 ? (
          <>
            {searchUsers.map((user) => (
              <div
                key={user._id}
                className={`message_chatlist-user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
              </div>
            ))}{" "}
            :
          </>
        ) : (
          <>
            {message.users.map((user) => (
              <div
                key={user._id}
                className={`message_chatlist-user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} msg={true}>
                  {user.online ? (
                    <i className="fas fa-circle text-success" />
                  ) : (
                    auth.user.following.find(
                      (item) => item._id === user._id
                    ) && <i className="fas fa-circle" />
                  )}
                </UserCard>
              </div>
            ))}
          </>
        )}

        <button ref={pageEnd} style={{ opacity: 0 }}>
          Load More
        </button>
      </div>
    </>
  );
};

export default LeftSide;
