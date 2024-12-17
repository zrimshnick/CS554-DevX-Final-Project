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

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/${currentUser.email}`
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
              <button type="button">
                {/* onClick={openEditProfile} */}
                Edit Profile
              </button>
              <SignOutButton></SignOutButton>
            </Box>
          </Box>

          {/* Profile Information */}
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
            <button type="button" onClick={() => setIsChangePasswordOpen(true)}>
              Change Password
            </button>
          </Box>
        </CardContent>
      </Card>

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
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(false)}
            >
              Cancel
            </button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;