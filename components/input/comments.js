import { useEffect, useState } from "react";
import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";

function Comments({ eventId }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const toggleCommentsHandler = () => {
    setShowComments((prevStatus) => !prevStatus);
  };
  useEffect(async () => {
    if (showComments) {
      try {
        const response = await fetch(`/api/comments/${eventId}`);
        const data = await response.json();
        setComments(data?.comments);
      } catch (e) {
        console.log(e);
      }
    }
  }, [showComments]);
  const addCommentHandler = async (commentData) => {
    try {
      const response = await fetch(`/api/comments/${eventId}`, {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList items={comments} />}
    </section>
  );
}

export default Comments;
