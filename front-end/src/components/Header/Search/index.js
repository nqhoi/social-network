import UserCard from "components/UserCard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "redux/actions/globalTypes";
import { getDataAPI } from "utils/fetchData";
import "./Search.scss";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (search && auth.token) {
      getDataAPI(`search?username=${search}`, auth.token)
        .then((res) => setUsers(res.data.users))
        .catch((err) => {
          dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg },
          });
        });
    } else {
      setUsers([]);
    }
  }, [search, auth.token, dispatch]);

  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   if(!search) return

  // try {
  //   const res = await  getDataAPI(`search?username=${search}`, auth.token)
  // } catch (err) {
  //   dispatch({
  //     type: GLOBALTYPES.ALERT,
  //     payload: { error: err.response.data.msg },
  //   });
  // }
  // }

  const handleClose = () => {
    setSearch("");
    setUsers([]);
  };

  return (
    <div className="header-search">
      <form className="search-form">
        <input
          type="text"
          name="search"
          id="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value.toLowerCase().replace(/ /g, ""))
          }
        />

        <div className="search-form-icon" style={{ opacity: search ? 0 : 0.3 }}>
          <span className="material-icons">search</span>
          <span>Search</span>
        </div>

        <div
          className="search-form-close"
          style={{ opacity: users.length === 0 ? 0 : 1 }}
          onClick={handleClose}
        >
          &times;
        </div>
        {/* <button type="submit">Search</button> */}

        <div className="search-form-users">
          {search &&
            users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                border="border"
                handleClose={handleClose}
              />
            ))}
        </div>
      </form>
    </div>
  );
};

export default Search;
