import React, { useEffect, useState } from "react";
import CommentCard from "../CommentCard";
import "./CommentDisplay.scss";

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showReply, setShopReply] = useState([])
  const [next, setNext] = useState(1)

  // Hiển thị tối đa 1 reply
  useEffect(() => {
    setShopReply(replyCm.slice(replyCm.length - next))
  },[replyCm, next])

  return (
    <div className="commentdisplay">
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className="pl-4 pt-2">
          {showReply.map((item, index) =>item.reply && (
              <CommentCard
                key={index}
                comment={item}
                post={post}
                commentId={comment._id}
              />
            )
          )}
          
          {replyCm.length - next > 0 ? (
            <div
              style={{ color: "gray", cursor: "pointer" }}
              onClick={() => setNext(next + 10)}
            >
                See more comments ...
            </div>
          ) : (
            replyCm.length > 1 && (
              <div
                style={{ color: "gray", cursor: "pointer" }}
                onClick={() => setNext(1)}
              >
                Hide comments ...
              </div>
            )
          )}
          
        </div>
      </CommentCard>
    </div>
  );
};

export default CommentDisplay;
