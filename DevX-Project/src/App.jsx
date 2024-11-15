import { useState } from "react";
import "./App.css";
import logoIcon from "./img/logo.png";
import profileIcon from "./img/profileIcon.png";
import { Route, Link, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import Auth from "./components/Auth";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Chats from "./components/Chats";
import Explore from "./components/Explore";

function App() {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* return (
      <div className="App">
        {isAuthenticated ? (
          <>
            <div className="App-navbar-container">
              <Link className="App-navbar-title" to="/">
                <img
                  className="App-navbar-logo"
                  src={logoIcon}
                  alt="Coffee Connections Logo"
                />
                Coffee Connections
              </Link>
              <div className="App-navbar-link-container">
                <Link className="navbarLink" to="/explore">
                  Explore
                </Link>
                <Link className="navbarLink" to="/chats">
                  Chats
                </Link>
                <Link className="navbarLink" to="/profile">
                  <img
                    className="App-navbar-logo"
                    src={profileIcon}
                    alt="Profile Icon"
                  />
                </Link>
              </div>
            </div>
            <div className="App-content-container">
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/profile/:id" element={<Profile />}></Route>
                <Route path="/chats" element={<Chats />}></Route>
                <Route path="/explore" element={<Explore />}></Route>
              </Routes>
            </div>
          </>
        ) : (
          // Render Auth component if not authenticated
          <>
            <div className="App-navbar-container">
              <Link className="App-navbar-title">
                <img
                  className="App-navbar-logo"
                  src={logoIcon}
                  alt="Coffee Connections Logo"
                />
                Coffee Connections
              </Link>
              <div className="App-navbar-link-container">
                <Link className="navbarLink">Explore</Link>
                <Link className="navbarLink">Chats</Link>
                <Link className="navbarLink">
                  <img
                    className="App-navbar-logo"
                    src={profileIcon}
                    alt="Profile Icon"
                  />
                </Link>
              </div>
            </div>
            <Auth />
          </>
        )}
      </div>
  ); */
  return (
    <AuthProvider>
      <div className="App">
        <Navigation></Navigation>
        <div className="App-content-container">
          <Routes>
            <Route path="/" element={<Auth />}></Route>

            <Route path="/home" element={<PrivateRoute />}>
              <Route path="/home" element={<Home />}></Route>
            </Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>

            {/* <Route path="/profile/:id" element={<Profile />}></Route> */}
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />}></Route>
            </Route>

            <Route path="/chats" element={<PrivateRoute />}>
              <Route path="/chats" element={<Chats />}></Route>
            </Route>

            <Route path="/explore" element={<PrivateRoute />}>
              <Route path="/explore" element={<Explore />}></Route>
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
