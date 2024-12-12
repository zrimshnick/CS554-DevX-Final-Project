import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

// do this formally later
const checkProfileCompletion = (user) => {
  return user?.profileComplete;
};

// profile completion form modal
const ProfileForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bio: "",
    age: "",
    gender: "",
    streetAddress: "",
    city: "",
    state: "",
    profilePicture: null,
    preferredGender: [],
    preferredAgeMin: "",
    preferredAgeMax: "",
  });

  const [errors, setErrors] = useState({
    age: "",
    gender: "",
    streetAddress: "",
    city: "",
    state: "",
    preferredGender: "",
    preferredAge: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData({
      ...formData,
      profilePicture: files[0] || null, // if no pfp is attached, set to null
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      preferredGender: checked
        ? [...formData.preferredGender, value]
        : formData.preferredGender.filter((gender) => gender !== value),
    });

    setErrors({
      ...errors,
      preferredGender: "",
    });
  };

  const calculatePreferredAgeRange = (age) => {
    let minAge = age - 5 > 13 ? age - 5 : 13; // min age (age - 5, but not less than 13)
    let maxAge = age + 5 < 120 ? age + 5 : 120; // max age (age + 5, but not greater than 120)
    return { minAge, maxAge };
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      age: "",
      gender: "",
      streetAddress: "",
      city: "",
      state: "",
      preferredGender: "",
      preferredAge: "",
    };
    
    // validate age (13-120)
    if (!formData.age || formData.age < 13 || formData.age > 120) {
      newErrors.age = "Age must be between 13 and 120.";
      isValid = false;
    }

    // validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }

    // validate street address
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required.";
      isValid = false;
    }

    // validate city
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
      isValid = false;
    }

    // validate state
    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
      isValid = false;
    }

    // validate preferred gender(s)
    if (formData.preferredGender.length === 0) {
      newErrors.preferredGender = "Preferred gender(s) are required.";
      isValid = false;
    }

    // validate preferred age range
    if (formData.preferredAgeMin === "" || formData.preferredAgeMax === "") {
      newErrors.preferredAge = "Preferred age range is required.";
      isValid = false;
    } else if (
      formData.preferredAgeMin >= formData.preferredAgeMax ||
      formData.preferredAgeMin < 13 ||
      formData.preferredAgeMax > 120
    ) {
      newErrors.preferredAge = "Preferred age range is invalid.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  useEffect(() => {
    if (formData.age) {
      const { minAge, maxAge } = calculatePreferredAgeRange(formData.age);
      setFormData((prevData) => ({
        ...prevData,
        preferredAgeMin: minAge,
        preferredAgeMax: maxAge,
      }));
    }
  }, [formData.age]);

  return (
    <Card sx={{ width: 500, margin: "auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Complete Your Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Bio (Optional)"
            variant="outlined"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            label="Age"
            variant="outlined"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.age)}
            helperText={errors.age}
          />

          <FormControl fullWidth margin="normal" error={Boolean(errors.gender)}>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Non-Binary">Non-Binary</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="Rather Not Say">Rather Not Say</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>

          <TextField
            label="Street Address"
            variant="outlined"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.streetAddress)}
            helperText={errors.streetAddress}
          />

          <TextField
            label="City"
            variant="outlined"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.city)}
            helperText={errors.city}
          />

          <TextField
            label="State"
            variant="outlined"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.state)}
            helperText={errors.state}
          />

          <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
          >
            Upload Profile Picture
            <input
              type="file"
              hidden
              name="profilePicture"
              onChange={handleFileChange}
            />
          </Button>

          <FormControl component="fieldset" fullWidth margin="normal" error={Boolean(errors.preferredGender)}>
            <Typography variant="body1">Preferred Gender(s):</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value="Male"
                    checked={formData.preferredGender.includes("Male")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Male"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="Female"
                    checked={formData.preferredGender.includes("Female")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Female"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="Non-Binary"
                    checked={formData.preferredGender.includes("Non-Binary")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Non-Binary"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="Other"
                    checked={formData.preferredGender.includes("Other")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Other"
              />
            </FormGroup>
            {errors.preferredGender && <FormHelperText>{errors.preferredGender}</FormHelperText>}
          </FormControl>

          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <TextField
              label="Preferred Age Min"
              variant="outlined"
              name="preferredAgeMin"
              value={formData.preferredAgeMin}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Preferred Age Max"
              variant="outlined"
              name="preferredAgeMax"
              value={formData.preferredAgeMax}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          {errors.preferredAge && (
            <Typography color="error" variant="body2">
              {errors.preferredAge}
            </Typography>
          )}

          <Box display="flex" justifyContent="center" marginTop={3}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginRight: 2 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

function CompleteProfile (props){
  const {id: userId} = useParams()
  const [user, setUser] = useState({
    profileComplete: false,
  });
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      let currentUser = null;
      try {
        const response = await fetch(`http://localhost:3000/user/id/${userId}`, {
          method: "GET"
        });
        if (!response.ok) {
          const error = await response.json();
          console.error("Error getting user:", error);
          alert("Error retrieving user data. Please try again.");
          return;
        }
        currentUser = await response.json();
        setUser(currentUser);
      } catch (e) {
        console.error("Error fetching user:", e);
        alert("Could not connect to the server. Please try again later.");
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!checkProfileCompletion(user)) {
      setShowProfileForm(true);
    }
  }, [user]);

  const handleProfileSubmit = (newProfileData) => {
    console.log("Submitting new profile data:", newProfileData);
    setUser((prevUser) => ({
      ...prevUser,
      profileComplete: true,
    }));
    setShowProfileForm(false);
  };

  return (
    <div className="Home">
      <h1>Welcome back!</h1>

      {showProfileForm && (
        <ProfileForm onSubmit={handleProfileSubmit} />
      )}
    </div>
  );
}

export default CompleteProfile;
