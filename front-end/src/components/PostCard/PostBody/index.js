import Carousel from "components/Carousel";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import './PostBody.scss'

const PostBody = ({ post }) => {
  const { theme} = useSelector((state) => state)

  const [readMore, setReadMore] = useState(false);
  

  return (
    <div className="postbody">
      <div className="postbody-content"
        style={{ 
          filter: theme ? "invert(1)" : "invert(0)",
          color: theme ? "white" : "#000" 
        }}
      >
        <span>
          {post.content.length < 60
            ? post.content: readMore
            ? post.content + " ": post.content.slice(0, 60) + " ... "}
        </span>

        {post.content.length > 60 && (
          <span className="readMore" onClick={() => setReadMore(!readMore)}>
            {readMore ? "Hide content" : "Read more"}
          </span>
        )}
      </div>
      {post.images.length > 0 && (
        <Carousel images={post.images} id={post._id} />
      )}
    </div>
  );
};

export default PostBody;
