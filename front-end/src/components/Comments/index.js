import React, { useEffect, useState } from "react";
import CommentDisplay from "./CommentDisplay";

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);
  const [replyComments, setReplyComments] = useState([]);

  // Hiển thị tối ta 2 comment
  useEffect(() => {
    const newCm = post.comments.filter((cm) => !cm.reply);
    setComments(newCm);
    setShowComments(newCm.slice(newCm.length - next));
  }, [post.comments, next]);

  // Hiển thị reply comment
  useEffect(() => {
    const newReply = post.comments.filter((cm) => cm.reply);
    setReplyComments(newReply);
  }, [post.comments]);

  return (
    <div className="comment">
      {showComments.map((comment, index) => (
        <CommentDisplay
          key={index}
          comment={comment}
          post={post}
          replyCm={replyComments.filter((item) => item.reply === comment._id)}
        />
      ))}

      {comments.length - next > 0 ? (
        <div
          className="p-2 botder-top"
          style={{ color: "gray", cursor: "pointer" }}
          onClick={() => setNext(next + 10)}
        >
          See more comments ...
        </div>
      ) : (
        comments.length > 2 && (
          <div
            className="p-2 botder-top"
            style={{ color: "gray", cursor: "pointer" }}
            onClick={() => setNext(2)}
          >
            Hide comments ...
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
