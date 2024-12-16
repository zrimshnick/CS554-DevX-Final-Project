import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, TextField, Button, Box, Typography, Select, CircularProgress, MenuItem, FormControl, InputLabel, FormHelperText, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

const checkProfileCompletion = (user) => {
  return (user.age != 0 &&
    user.gender != "" &&
    user.streetAddress != "" &&
    user.city != "" &&
    user.state != "" &&
    user.postalCode != 0 &&
    user.preferredGender != [] &&
    user.preferredAgeMin != 0 &&
    user.preferredAgeMax != 0
  )
};

// profile completion form modal
const ProfileForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bio: "",
    age: 0,
    gender: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: 0,
    profilePicture: null,
    preferredGender: [],
    preferredAgeMin: 0,
    preferredAgeMax: 0,
  });

  const [errors, setErrors] = useState({
    age: "",
    gender: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    preferredGender: "",
    preferredAge: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'preferredAgeMin' || name === 'preferredAgeMax' || name == 'age') {
      setFormData({
        ...formData,
        [name]: value ? Number(value) : '', // convert to number, or set as empty string if blank
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  

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
      postalCode: "",
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

    if(!formData.postalCode || formData.postalCode < 10000 || formData.postalCode > 99999){
      newErrors.postalCode = "Postal code must be a 5-digit number.";
      isValid = false;
    }
    // validate preferred gender(s)
    if (formData.preferredGender.length === 0) {
      newErrors.preferredGender = "Preferred gender(s) are required.";
      isValid = false;
    }

    if (formData.preferredAgeMin === "" || formData.preferredAgeMax === "") {
      newErrors.preferredAge = "Preferred age range is required.";
      isValid = false;
    } else {
      // ensure preferredAgeMin and preferredAgeMax are between 13 and 120
      if (formData.preferredAgeMin < 13 || formData.preferredAgeMin > 120) {
        newErrors.preferredAge = "Preferred age minimum must be between 13 and 120.";
        isValid = false;
      }
      if (formData.preferredAgeMax < 13 || formData.preferredAgeMax > 120) {
        newErrors.preferredAge = "Preferred age maximum must be between 13 and 120.";
        isValid = false;
      }
  
      // ensure preferredAgeMax is greater than or equal to preferredAgeMin
      if (formData.preferredAgeMin >= formData.preferredAgeMax) {
        newErrors.preferredAge = "Preferred age maximum must be greater than preferred age minimum.";
        isValid = false;
      }
    }
  

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("first")
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

          <TextField
            label="Postal Code"
            variant="outlined"
            name="postalCode"
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
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
              accept=".jpg,.jpeg"
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
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              label="Preferred Age Max"
              variant="outlined"
              name="preferredAgeMax"
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
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

function CompleteProfile ({onSubmit}){
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      if (currentUser?.email) {
        try {
          const response = await fetch(`http://localhost:3000/user/${currentUser.email}`, {
            method: "GET"
          });
          
          if (!response.ok) {
            setIsLoading(false);
            setShowProfileForm(true);
            return;
          }
          
          const fetchedUser = await response.json();
          setUser(fetchedUser);

          if (!checkProfileCompletion(fetchedUser)) {
            setShowProfileForm(true);
          }
          
          setIsLoading(false);
        } catch (e) {
          console.error("Error fetching user:", e);
          setIsLoading(false);
          setShowProfileForm(true);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [currentUser]);

  const handleProfileSubmit = async (newProfileData) => {
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
  
      const response = await fetch("http://localhost:3000/user/", {
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
      setShowProfileForm(false);
      setIsLoading(false);
      onSubmit(updatedUser)
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
  else {
    return (
      <div className="Home">
        {showProfileForm && (
          <ProfileForm onSubmit={handleProfileSubmit} />
        )}
      </div>
    );
  }
}

export default CompleteProfile;
