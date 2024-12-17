import React, { useEffect, useRef, useState, useContext } from "react";
import "../App.css";
import "./Explore.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TinderCard from "react-tinder-card";

function Explore() {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(null);
  const cardRefs = useRef([]);
  const [canAccessExplore, setCanAccessExplore] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
      if (currentUser?.email) {
        try {
          const response = await fetch(
            `http://localhost:3000/user/${currentUser.email}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            const error = await response.json();
            console.error("Error fetching user data", error);
            return;
          }

          const userData = await response.json();

          // Check if swiped array is empty
          if (!userData.age || userData.age === 0) {
            setCanAccessExplore(false);
          } else {
            setCanAccessExplore(true);
          }
        } catch (e) {
          console.error("Error connecting to MongoDB API:", e);
          alert("Could not connect to the server. Please try again later.");
        }
      }
    };
    const getAllUsers = async (e) => {
      // get all users they can select from
      if (currentUser?.email) {
        try {
          const response = await fetch(`http://localhost:3000/user/explore/${currentUser.email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            const error = await response.json();
            console.error("Error getting all users from MongoDB", error);
            alert("Error getting all users from MongoDB. Please try again.");
            return;
          }
    
          let allUsers = await response.json();
          allUsers = allUsers.filter((obj) => obj.email !== currentUser.email); // dont show the user themselves
          setUsers(allUsers);

          // init cardRefs
          cardRefs.current = Array(allUsers.length)
            .fill(0)
            .map((i) => React.createRef());

          setUsers(allUsers);
          setCurrentIndex(allUsers.length - 1);
        } catch (e) {
          console.error("Error connecting to MongoDB API:", e);
          alert("Could not connect to the server. Please try again later.");
        }
      }
    };

    checkUserData();
    if (canAccessExplore) {
      getAllUsers();
    }

  }, [currentUser, canAccessExplore]);

  const handleChatNav = () => {
    navigate('/chats');
  };

  const handleSwipe = async (direction, userSwiped) => {
    console.log("handling swipe!")
    const updatedCurrentUser = await updateSwipedArray(
      direction,
      userSwiped.email
    );
    checkForMatch(userSwiped.email, updatedCurrentUser);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const updateSwipedArray = async (direction, swipedUserEmail) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${currentUser.email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating swiped array", error);
        alert("Error updating swiped array. Please try again.");
        return;
      }
      const userData = await response.json();
      const newSwiped = {email: swipedUserEmail, swipedRight: direction === "right"};
      userData.swiped.push(newSwiped)
      let dataToSend = {
        email: userData.email,
        swiped: userData.swiped
      }
      const response2 = await fetch(
        `http://localhost:3000/user`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend)
        }
      );
      if (!response2.ok) {
        const error = await response2.json();
        console.error("Error updating swiped array", error);
        alert("Error updating swiped array. Please try again.");
        return;
      }
      const updatedUser = await response2.json();
      return updatedUser;
    } catch (e) {
      console.error("Error connecting to MongoDB API:", e);
      alert("Could not connect to the server. Please try again later.");
    }
  };
  const checkForMatch = async (otherUserEmail, updatedCurrentUser) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${otherUserEmail}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching other user details");
      }
      const otherUserData = await response.json();

      // check if the other user has swiped right on the current user
      const otherUserSwiped = otherUserData.swiped.find(
        (swipe) => swipe.email === currentUser.email
      );
      const currentUserSwiped = updatedCurrentUser.swiped.find(
        (swipe) => swipe.email === otherUserEmail
      );
      if (
        otherUserSwiped &&
        otherUserSwiped.swipedRight &&
        currentUserSwiped &&
        currentUserSwiped.swipedRight
      ) {
        // matched -> create chat
        console.log("Users matched");
        handleCreateChat(otherUserEmail, updatedCurrentUser, otherUserData);
        alert(`You matched with ${otherUserData.firstName}! Go to your chats to start talking!`);
      }
    } catch (e) {
      console.error("Error checking for match:", e);
      alert("Could not check for match. Please try again.");
    }
  };

  const handleCreateChat = async (otherUserEmail) => {
    console.log("creating chat")
    try {
      const currentUserResponse = await fetch(
        `http://localhost:3000/user/${currentUser.email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!currentUserResponse.ok) {
        throw new Error("Error fetching current user details");
      }

      const currentUserData = await currentUserResponse.json();

      const otherUserResponse = await fetch(
        `http://localhost:3000/user/${otherUserEmail}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!otherUserResponse.ok) {
        throw new Error("Error fetching other user details");
      }

      const otherUserData = await otherUserResponse.json();

      // Create a new chat
      const chatResponse = await fetch(`http://localhost:3000/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1: currentUserData._id,
          user2: otherUserData._id,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error("Error creating chat");
      }

      // Navigate to the chats route
      navigate("/chats");
    } catch (e) {
      console.error("Error handling chat creation:", e);
      alert("Could not create chat. Please try again.");
    }
  };

  return (
    <div className="Explore-Container">
    <div className="Explore-header">Explore</div>
    <div className="Explore-subheader">
      Swipe right to like, left to pass.
    </div>
    <div className="Explore-card-container">
      {currentIndex >= 0 &&
        users.map((user, index) => (
          <TinderCard
            ref={cardRefs.current[index]}
            key={user.email}
            onSwipe={(dir) => handleSwipe(dir, user)}
            onCardLeftScreen={() =>
              setCurrentIndex((prevIndex) => prevIndex - 1)
            }
            preventSwipe={["up", "down"]}
            className="swipe"
          >
            <div
              className="Explore-card"
              style={{
                backgroundImage: user.profilePicture
                  ? `url(${user.profilePicture})`
                  : "none",
              }}
            >
              <div className="Explore-card-content">
                <div className="Explore-card-title">
                  <h3>{user.name || user.email}</h3>
                </div>
                <div className="Explore-card-info">
                  {user.age && <p>Age: {user.age}</p>}
                  {user.gender && <p>Gender: {user.gender}</p>}
                  {user.bio && <p className="bio">Bio: {user.bio}</p>}
                </div>
              </div>
              {!user.profilePicture && (
                <p className="Explore-no-profile-picture">
                  This user has not uploaded a profile picture yet.
                </p>
              )}
            </div>
          </TinderCard>
        ))}
        <div className="Explore-no-users">
          <button className="Explore-no-users-button" onClick={handleChatNav}>
            No more users to swipe on at the moment. <br /> Enjoy connecting with your current beans!
          </button>
        </div>
    </div>
  </div>
  );
}

export default Explore;
