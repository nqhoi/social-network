import Comments from "components/Comments";
import InputComment from "components/Comments/InputComment";
import React from "react";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

const PostCard = ({ post }) => {
  return (
    <div className="postcard" style={{ background: '#fff', margin: "20px 0"}}>
      <PostHeader post={post} />
      <PostBody post={post} />
      <PostFooter post={post} />

      <Comments post={post} />
      <InputComment post={post} />
    </div>
  );
};

export default PostCard;
