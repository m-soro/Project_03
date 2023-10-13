import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.modules.css";

export default function Auth() {
  const [showLogIn, setShowLogIn] = useState(false);

  return (
    <div className="Auth auth-page container">
      {showLogIn ? <Login /> : <Register />}

      <Link onClick={() => setShowLogIn(!showLogIn)}>
        <p></p>
        {showLogIn ? (
          <p>Don't have an account? Register</p>
        ) : (
          <p>Have an account? Log in</p>
        )}
      </Link>
    </div>
  );
}

// LOGIN COMPONENT
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // set the jwt token to cookie using the useCookies hook
  // the cookie is not needed, only need the function that sets the cookie
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // make a post request, but this time we are going to use the authenticated token
      // get the received response from the api - the jwt token from the backend
      const response = await axios.post(
        "https://open-peaks-v2-backend.onrender.com/auth/login",
        {
          username,
          password,
        }
      );
      // console.log(response.data.message);
      if (response.data.message) alert(response.data.message);
      if (response.data.token) {
        // set the response to cookie
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
        window.localStorage.setItem("userName", username);
        // after successful login - redirect to homepage using useNavigate hook
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Log In"
      placeholder="User name"
      onSubmit={onSubmit}
      message="See latest updates of your favorite snow sports destinations"
    />
  );
};
// REGISTER COMPONENT
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"]);

  const onSubmit = async (event) => {
    event.preventDefault();
    // using axios to make a post request to auth/register api
    // first argument is url, then object for the body of the request
    try {
      const response = await axios.post(
        "https://open-peaks-v2-backend.onrender.com/auth/register",
        {
          username,
          password,
        }
      );
      alert(response.data.message);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form
      onSubmit={onSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      placeholder="User name"
      label="Sign up"
      message="Create an account to keep track of your favorite snow sports destinations"
    />
  );
};

// Make form generic, it is used for signing up and signing in
// the onSubmit props will be called whenever a user submits a form
// Each component that uses the form, will have a specific onSubmit function
// which do different things
const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  message,
  onSubmit,
  placeholder,
}) => {
  const [randomImage, setRandomImage] = useState("");

  let picArray = [
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
    "05.png",
    "06.jpeg",
    "07.jpeg",
  ];

  const random = () => {
    return picArray[Math.floor(Math.random() * picArray.length)];
  };

  useEffect(() => {
    setRandomImage(random());
  }, []);

  return (
    <main className="container">
      <article className="grid">
        <div>
          <hgroup>
            <h1>{label}</h1>
            <p>{message}</p>
          </hgroup>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="login"
              placeholder={placeholder}
              aria-label="Login"
              value={username.charAt(0).toUpperCase() + username.slice(1)}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="secondary">
              {label}
            </button>
          </form>
        </div>
        <div
          style={{
            backgroundImage: `url(https://github.com/m-soro/Project_2/blob/main/src/assets/images/${randomImage}?raw=true)`,
          }}
        ></div>
      </article>
    </main>
  );
};
