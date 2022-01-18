import { useContext, useEffect, useState } from "react";
import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";
import NotificationContext from "../../store/notification-context";

function Comments({ eventId }) {
  const { showNotification } = useContext(NotificationContext);
  const [showComments, setShowComments] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [comments, setComments] = useState([]);
  const toggleCommentsHandler = () => {
    setShowComments((prevStatus) => !prevStatus);
  };
  useEffect(async () => {
    if (showComments) {
      try {
        setIsFetchingComments(true);
        const response = await fetch(`/api/comments/${eventId}`);
        const data = await response.json();
        setComments(data?.comments);
      } catch (e) {
        console.log(e);
      } finally {
        setIsFetchingComments(false);
      }
    }
  }, [showComments]);
  const addCommentHandler = async (commentData) => {
    try {
      showNotification({
        title: "Sending comment",
        message: "your comment is being stored.",
        status: "pending"
      });
      const response = await fetch(`/api/comments/${eventId}`, {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong.");
      }
      showNotification({
        title: "Success",
        message: "Your comment was saved.",
        status: "success"
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: error?.message || "Something went wrong.",
        status: "error"
      });
    }
  };
  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments &&
        (isFetchingComments ? (
          <p>Loading ...</p>
        ) : (
          <CommentList items={comments} />
        ))}
    </section>
  );
}

export default Comments;
