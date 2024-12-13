import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import "./Home.css";
import { AuthContext } from "../context/AuthContext";
import FriendsList from "./FriendsList"; // Import FriendsList component

const videoSrc = "/src/assets/videos/coffeeFinal.mp4";

function Home(props) {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:3000/user/${currentUser.email}`);
          const data = await response.json();
          setUserData({ firstName: data.firstName, lastName: data.lastName });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleVideoEnd = () => {
    setFade(true);
    setTimeout(() => {
      const videoElement = document.getElementById("background-video");
      videoElement.currentTime = 0;
      videoElement.play();
      setFade(false);
    }, 1000); // Duration of the fade-out effect
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Home">
      <video
        id="background-video"
        autoPlay
        muted
        className={`Home-video-background ${fade ? "fade-out" : "fade-in"}`}
        onEnded={handleVideoEnd}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="Home-content">
        <div className="Home-text-container">
          <h1 className="Home-welcome-message">
            Welcome {userData.firstName} {userData.lastName}!
          </h1>
          <p className="Home-tagline">
            Meet, sip, and connect
          </p>
          <p className="Home-subtagline">
            your coffee adventure awaits.
          </p>
        </div>
        <FriendsList /> {/* Add FriendsList component here */}
      </div>
    </div>
  );
}

export default Home;