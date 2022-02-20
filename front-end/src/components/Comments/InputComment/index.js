import Icons from "components/Icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "redux/actions/commentAction";
import "./InputComment.scss";

const InputComment = ({ children, post, onReply, setOnReply }) => {
  const [content, setContent] = useState("");

  const { auth , socket, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  // event comment or reply comment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      if(setOnReply) return setOnReply(false)
      return;
    }

    setContent("")

    const newComment = {
        content,
        likes: [],
        user: auth.user,
        createdAt: new Date().toISOString(),
        reply: onReply && onReply.commentId,
        tag: onReply && onReply.user
    }
    dispatch(createComment({post, newComment, auth, socket}))

    if(setOnReply) return setOnReply(false)

  };

  return (
    <form className="inputcommnet"  onSubmit={handleSubmit}>
      {children}
      <input
        type="text"
        placeholder="Add your Comments..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ 
          filter: theme ? "invert(1)" : "invert(0)",
          color: theme ? "#fff" : "#000" ,
          background: theme ? 'rgba(0,0,0,.03)' : '',
        }}
      />

      <Icons setContent={setContent} content={content} theme={theme} />

      <button type="submit" className="inputcommnet-btnPost">
        Post
      </button>
    </form>
  );
};

export default InputComment;
