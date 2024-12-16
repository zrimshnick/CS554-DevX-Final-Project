import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import "./Home.css";
import { AuthContext } from "../context/AuthContext";
import FriendsList from "./FriendsList"; // Import FriendsList component
import CompleteProfileForm from "./CompleteProfile";

function Home(props) {
  const { currentUser } = useContext(AuthContext);
  const [fade, setFade] = useState(false);
  const [profile, setProfile] = useState(null); 
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [rerender, setReRender] = useState(false);
  const videoUrl = 'https://devx2024.s3.amazonaws.com/CoffeeFinal.mp4';

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3000/user/${currentUser.email}`, {
            method: "GET"
          });
          if (!response.ok) {
            const error = await response.json();
            console.error("Error getting user:", error);
            alert("Error retrieving user data. Please try again.");
            return;
          }
          const updatedUser = await response.json();
          console.log(updatedUser)
          setProfile(updatedUser);
        } catch (e) {
          console.error("Error fetching user:", e);
          alert("Could not connect to the server. Please try again later.");
        }
    };

    fetchUser();
  }, [currentUser]);

  useEffect(() => {
    if (profile) {
      if (
        profile.age == 0 ||
        profile.gender == "" ||
        profile.streetAddress == "" ||
        profile.city == "" ||
        profile.state == "" ||
        profile.preferredGender == [] ||
        profile.preferredAgeMin == 0 ||
        profile.preferredAgeMax == 0
      ) {
        setOpenProfileModal(true);
      }
    }
  }, [profile]);

  useEffect(() => {
    setReRender(true);
  }, [openProfileModal])

  const handleVideoEnd = () => {
    setFade(true);
    setTimeout(() => {
      const videoElement = document.getElementById("background-video");
      videoElement.currentTime = 0;
      videoElement.play();
      setFade(false);
    }, 1000); // Duration of the fade-out effect
  };

  const handleProfileComplete = (updatedProfile) => {
    console.log("here")
    setProfile(updatedProfile);
    setOpenProfileModal(false);
    alert("Profile completed!");
  }


  if (!currentUser) {
    return (
      <div>Loading...</div>
    );
  }
  else if (profile){
    return (
      <div className="Home">
          {openProfileModal ? (
            <div className="profile-form-container">
              <h1 className="welcome">Welcome!</h1>
              <CompleteProfileForm
                open={openProfileModal}
                onSubmit={handleProfileComplete}
              />
            </div>
          ) : (
            <div className="home-content-centered">
              <video
                id="background-video"
                autoPlay
                muted
                className={`Home-video-background ${fade ? "fade-out" : "fade-in"}`}
                onEnded={handleVideoEnd}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="Home-content">
                <div className="Home-text-container">
                  <h1 className="Home-welcome-message">
                    Welcome {profile?.firstName} {profile?.lastName}!
                  </h1>
                  <p className="Home-tagline">Meet, sip, and connect</p>
                  <p className="Home-subtagline">your coffee adventure awaits.</p>
                </div>
                <FriendsList />
              </div>
            </div>
        )}
      </div>
    );
  }
}

export default Home;
