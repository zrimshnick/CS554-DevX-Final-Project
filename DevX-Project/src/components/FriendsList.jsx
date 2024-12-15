import React, { useEffect, useState, useContext } from 'react';
import { Grid, Avatar, Typography, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FriendsList = () => {
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriendsData = async (friendIds) => {
      try {
        const friendsData = await Promise.all(
          friendIds.map(async (id) => {
            const response = await fetch(`http://localhost:3000/user/id/${id}`);
            const data = await response.json();
            return data;
          })
        );
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };

    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:3000/user/${currentUser.email}`);
          const data = await response.json();
          fetchFriendsData(data.openChatPartners);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div className="FriendsList-container">
      <Paper sx={{ padding: 2, borderRadius: 2, width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          My Coffee Beans
        </Typography>
        <Grid container spacing={2} justifyContent="flex-start">
          {friends.map((friend) => (
            <Grid item key={friend._id} xs={4} sm={3} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    margin: '0 auto',
                    borderRadius: '50%',
                  }}
                  alt={`${friend.firstName} ${friend.lastName}`}
                  src={friend.avatarUrl} // Assuming each friend has an avatar URL
                />
                <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                  <Link to={`/chats`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {friend.firstName} {friend.lastName}
                  </Link>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

export default FriendsList;