import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Modal,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import defaultProfileIcon from "../img/default-profileIcon.png"; 
import ChangePassword from "./ChangePassword"; 
import axios from "axios";
import "./Profile.css";
import SignOutButton from "./SignOut";
import {ProfileForm} from "./CompleteProfile";
const API_LOCAL = "http://localhost:3000"

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); 
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_HEROKU_SERVER || API_LOCAL}/user/${currentUser.email}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleProfileComplete = async (newProfileData) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", currentUser.email);

      for (const key in newProfileData) {
        if (key !== "profilePicture") {
          if (Array.isArray(newProfileData[key])) {
            newProfileData[key].forEach((item) =>
              formData.append(`${key}[]`, item)
            );
          } else if (
            key === "age" ||
            key === "preferredAgeMin" ||
            key === "preferredAgeMax"
          ) {
            formData.append(key, Number(newProfileData[key])); // Convert to number
          } else {
            formData.append(key, newProfileData[key]);
          }
        }
      }

      if (newProfileData.profilePicture) {
        formData.append("profilePicture", newProfileData.profilePicture);
      }

      console.log(formData)
  
      const response = await fetch(`${import.meta.env.VITE_HEROKU_SERVER || API_LOCAL}/user/`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating user in MongoDB:", error);
        alert("Error saving user data. Please try again.");
        setIsLoading(false);
        return;
      }

      const updatedUser = await response.json();
      console.log("User successfully updated in MongoDB");
      
      setUser(updatedUser);
      setIsEditProfileOpen(false);
      setIsLoading(false);
    } catch (e) {
      console.error("Error connecting to MongoDB API:", e);
      alert("Could not connect to the server. Please try again later.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="profilePage">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 3,
        }}
        className={"background-box"}
      >
        <Card sx={{ width: "60%", maxWidth: 800 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <Avatar
                src={user.profilePicture || defaultProfileIcon}
                alt="Profile Picture"
                sx={{ width: 100, height: 100 }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  variant="contained"
                >
                  Edit Profile
                </Button>
                <SignOutButton />
              </Box>
            </Box>

            <Typography variant="h5" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Age:</strong> {user.age}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Bio:</strong> {user.bio || "No bio provided."}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Gender:</strong> {user.gender}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Preferred Gender(s):</strong>{" "}
              {user.preferredGender.join(", ")}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Address:</strong>{" "}
              {`${user.streetAddress}, ${user.city}, ${user.state}, ${user.zip}`}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Preferred Age Range:</strong>{" "}
              {`${user.preferredAgeMin} - ${user.preferredAgeMax}`}
            </Typography>
            <Box sx={{ marginTop: 4, textAlign: "center" }}>
              <Button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                variant="outlined"
              >
                Change Password
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Modal
          open={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "80%",
              maxWidth: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              overflow: "auto",
              maxHeight: "90vh",
            }}
          >
            <ProfileForm
              onSubmit={handleProfileComplete}
            />
          </Box>
        </Modal>

        <Modal
          open={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <ChangePassword email={currentUser.email} />
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              <Button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                variant="outlined"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default Profile