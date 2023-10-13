import { Link } from "react-router-dom";
import "./NotLoggedIn.modules.css";

export default function NotLoggedIn() {
  return (
    <main className="NotLoggedIn container-fluid not-logged-in">
      <article className="not-logged-in-container grid">
        <div className="text not-logged-in-div">
          <h3>Hi, you are not logged in.</h3>
          <Link to="/auth">
            <p>Sign up or Log in</p>
          </Link>
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
