import React, { useState, useEffect } from "react";
import "../App.css";
import { Route, Link, Routes, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Profile(props) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(undefined);
  //const { id } = useParams();
  const id = 4;

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
    return <div className="Profile">Profile for {userData}</div>;
  }
}

export default Profile;
