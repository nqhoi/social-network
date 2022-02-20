import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./PostThumb.scss";

const PostThumb = ({ posts, result }) => {
  const { theme } = useSelector((state) => state);

  if(result === 0 ) return <h2 className="text-center text-danger">No Post</h2>;
  
  return (
    <div className="postthumb">
      {posts.map((post) => (
        <Link to={`/post/${post._id}`} key={post._id}>
          <div className="postthumb-display">
            
            {
              post.images[0].url.match(/video/i)
              ? <video controls src={post.images[0].url} alt={post.images[0].url}
                style={{filter: theme ? "invert(1)" : "invert(0)" }}
              />
              : <img  src={post.images[0].url} alt={post.images[0].url}
                style={{filter: theme ? "invert(1)" : "invert(0)" }}
              />
            }

            <img
              src={post.images[0].url}
              alt={post.images[0].url}
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            />

            <div className="postthumb-display-menu">
              <i className="far fa-heart">{post.likes.length}</i>
              <i className="far fa-comment">{post.likes.comment}</i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostThumb;
