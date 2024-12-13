// Home.jsx
import React, { useState, useEffect, useContext } from "react";
import CompleteProfileForm from "./CompleteProfile";
import { AuthContext } from "../context/AuthContext";

function Home(props) {
  const [profile, setProfile] = useState(null); 
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!profile) {return}

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

  const handleProfileComplete = (updatedProfile) => {
    setProfile(updatedProfile);
    setOpenProfileModal(false);
    alert("Profile completed!");
  };

  return (
    <div>
      <CompleteProfileForm
        open={openProfileModal}
        onProfileComplete={handleProfileComplete}
      />
    </div>
  );
}

export default Home;
