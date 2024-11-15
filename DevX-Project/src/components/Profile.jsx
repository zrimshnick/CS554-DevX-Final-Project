import React, { useState, useEffect } from "react";
import "../App.css";
import "./Profile.css";
import { Route, Link, Routes, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import profileIcon from "../img/default-profileIcon.png";
import SignOutButton from "./SignOut";

function Profile(props) {
  /* const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(undefined);
  const { id } = useParams();
  //const id = "6734f5821a6c894ffc4eea07";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:3000/user/${id}`);

        if (!data) {
          return false;
        }

        setUserData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="loadingText">Loading...</div>
      </div>
    );
  } else {
    return (
      <div className="Profile">
        <div className="Profile-left-container">
          <div className="Profile-left-photo-container">
            <img className="Profile-left-photo" src={profileIcon} />
          </div>
          <a className="Profile-left-button">Edit Profile / DM</a>
          <SignOutButton />
        </div>
        <div className="Profile-right-container">
          <div className="Profile-right-username">{userData.username}</div>
          <div className="Profile-right-name">
            {userData.firstName} {userData.lastName}
          </div>
          <div className="Profile-right-bio">{userData.bio}</div>
        </div>
      </div>
    );
  } */

  return (
    <div className="Profile">
      <div>Profile Page</div>
      <SignOutButton />
    </div>
  );
}

export default Profile;
