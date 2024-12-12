// Home.jsx
import React, { useState, useEffect } from "react";
import CompleteProfileForm from "./CompleteProfile";

function Home(props) {
  const [profile, setProfile] = useState(null); 
  const [openProfileModal, setOpenProfileModal] = useState(false);

  useEffect(() => {
    // Mock fetching user profile and determining if it is incomplete
    const fetchedProfile = {
      age: "",
      gender: "",
      streetAddress: "",
      city: "",
      state: "",
      bio: "",
      profilePicture: null,
    };

    setProfile(fetchedProfile);

    // check if the profile is incomplete
    if (!fetchedProfile.age || !fetchedProfile.gender || !fetchedProfile.streetAddress) {
      setOpenProfileModal(true);
    }
  }, []);

  const handleProfileComplete = (updatedProfile) => {
    setProfile(updatedProfile);
    setOpenProfileModal(false);
    alert("Profile completed!");
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <CompleteProfileForm
        open={openProfileModal}
        onProfileComplete={handleProfileComplete}
      />
    </div>
  );
}

export default Home;
