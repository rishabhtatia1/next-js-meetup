import { useContext, useRef } from "react";
import NotificationContext from "../../store/notification-context";
import classes from "./newsletter-registration.module.css";

function NewsletterRegistration() {
  const emailInputRef = useRef();
  const { showNotification } = useContext(NotificationContext);
  const registrationHandler = async (event) => {
    event.preventDefault();
    showNotification({
      title: "Signing Up",
      message: "Registering for newsletter.",
      status: "pending"
    });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: emailInputRef.current.value }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong.");
      }
      showNotification({
        title: "Success",
        message: "Succesfully registered for newsletter.",
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
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={emailInputRef}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
