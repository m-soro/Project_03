import "./NotLoggedIn.modules.css";
import { Link } from "react-router-dom";

export default function NotLoggedIn() {
  return (
    <main className="NotLoggedIn container-fluid not-logged-in">
      <article className="not-logged-in-container grid">
        <div className="text">
          <h3>You are not logged in.</h3>
          <Link to="/auth">Sign up or Log in</Link>
        </div>
        <div
          className="image"
          style={{
            backgroundImage: `url(https://www.medivet.co.uk/globalassets/assets/shutterstock-and-istock/istock/snow-dog.jpg?w=585&scale=down)`,
          }}
        ></div>
      </article>
    </main>
  );
}
