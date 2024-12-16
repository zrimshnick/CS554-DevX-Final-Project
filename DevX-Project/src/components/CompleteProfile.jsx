import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, TextField, Button, Box, Typography, Select, CircularProgress, MenuItem, FormControl, InputLabel, FormHelperText, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import "../App.css";
import axios from 'axios';

const checkProfileCompletion = (user) => {
  return (user.age != 0 &&
    user.gender != "" &&
    user.streetAddress != "" &&
    user.city != "" &&
    user.state != "" &&
    user.zip != "" &&
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
    zip: "",
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
    zip: "",
    preferredGender: "",
    preferredAge: "",
  });

  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData };
    let newErrors = { ...errors };

    // Validation Logic
    switch (name) {
      case "age":
        const age = value ? Number(value) : "";
        newFormData.age = age;
        if (age === "" || (age >= 13 && age <= 120)) {
          newErrors.age = "";
        } else {
          newErrors.age = "Age must be between 13 and 120.";
        }
        break;

      case "gender":
        newFormData.gender = value;
        if (value) {
          newErrors.gender = "";
        } else {
          newErrors.gender = "Gender is required.";
        }
        break;

      case "streetAddress":
        newFormData.streetAddress = value;
        if (value.trim()) {
          newErrors.streetAddress = "";
        } else {
          newErrors.streetAddress = "Street address is required.";
        }
        setIsAddressVerified(false);
        break;

      case "city":
        newFormData.city = value;
        if (value.trim()) {
          newErrors.city = "";
        } else {
          newErrors.city = "City is required.";
        }
        setIsAddressVerified(false);
        break;

      case "state":
        newFormData.state = value
        if (value.trim() && value.length === 2) {
          newErrors.state = "";
        } else {
          newErrors.state = "State code must be two characters.";
        }
        setIsAddressVerified(false);
        break;

      case "zip":
        newFormData.zip = value
        if (value.trim() === "" || (value.length === 5)) {
          newErrors.zip = "";
        } else {
          newErrors.zip = "Zip code must be 5 digits.";
        }
        setIsAddressVerified(false);
        break;

      case "preferredAgeMin":
        const minAge = value ? Number(value) : "";
        newFormData.preferredAgeMin = minAge;
        if (minAge === "" || (minAge >= 13 && minAge <= 120)) {
          if (formData.age && minAge < formData.age - 5) {
            newErrors.preferredAge = "Min age must be within 5 years of your age.";
          } else if (formData.preferredAgeMax && minAge > formData.preferredAgeMax) {
            newErrors.preferredAge = "Min age cannot be greater than max age."
          } else {
            newErrors.preferredAge = "";
          }
        } else {
            newErrors.preferredAge = "Min age must be between 13 and 120.";
        }
        break;

      case "preferredAgeMax":
        const maxAge = value ? Number(value) : "";
        newFormData.preferredAgeMax = maxAge;
        if (maxAge === "" || (maxAge >= 13 && maxAge <= 120)) {
          if (formData.age && maxAge > formData.age + 5) {
            newErrors.preferredAge = "Max age must be within 5 years of your age.";
          } else if (formData.preferredAgeMin && maxAge < formData.preferredAgeMin) {
            newErrors.preferredAge = "Max age cannot be less than min age.";
          } else {

            newErrors.preferredAge = "";
          }
        } else {
            newErrors.preferredAge = "Max age must be between 13 and 120.";
        }
        break;

      default:
        newFormData[name] = value;
    }

    setFormData(newFormData);
    setErrors(newErrors);
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

  const handleCheckAddress = async () => {
    setIsVerifyingAddress(true);
    let newErrors = { ...errors };
    const config = {
      headers: {
        Authorization: 'prj_live_pk_82edad404bea8ca5b2cccdf98595df5b2d9cbd67',
      },
      params: {
        countryCode: 'US',
        stateCode: formData.state,
        city: formData.city,
        postalCode: formData.zip,
        addressLabel: formData.streetAddress
      }
    };

    try {
      const response = await axios.get('https://api.radar.io/v1/addresses/validate', config);
      console.log('Response:', response.data);
      if (response.data.result.verificationStatus === 'verified') {
        setIsAddressVerified(true);
        newErrors.streetAddress = "";
        newErrors.city = "";
        newErrors.state = "";
        newErrors.zip = "";
      } else {
        setIsAddressVerified(false);
        newErrors.streetAddress = "Invalid address";
        newErrors.city = "Invalid address";
        newErrors.state = "Invalid address";
        newErrors.zip = "Invalid address";
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setIsAddressVerified(false);
      newErrors.streetAddress = "Error checking address";
      newErrors.city = "Error checking address";
      newErrors.state = "Error checking address";
      newErrors.zip = "Error checking address";
    } finally {
      setIsVerifyingAddress(false);
      setErrors(newErrors);
    }
  };

  const validatePreferredGenders = () => {
    if (formData.preferredGender.length === 0) {
      setErrors({
        ...errors,
        preferredGender: "Preferred gender(s) are required."
      });
      return false;
    }
    return true;
  };

  const validatePreferredAgeRange = () => {
    if (formData.preferredAgeMin === "" || (formData.preferredAgeMin >= 13 && formData.preferredAgeMin <= 120)) {
      if (formData.age && (formData.preferredAgeMin < formData.age - 5)) {
        setErrors({
          ...errors,
          preferredAge: "Min age must be within 5 years of your age."
        });
        return false;
      } else if (formData.preferredAgeMax && (formData.preferredAgeMin > formData.preferredAgeMax)) {
        setErrors({
          ...errors,
          preferredAge: "Min age cannot be greater than max age."
        });
        return false;
      } else {
        setErrors({
          ...errors,
          preferredAge: ""
        });
      }
    } else {
      setErrors({
        ...errors,
        preferredAge: "Min age must be between 13 and 120."
      });
      return false;
    }
    if (formData.preferredAgeMax === "" || (formData.preferredAgeMax >= 13 && formData.preferredAgeMax <= 120)) {
      if (formData.age && (formData.preferredAgeMax > formData.age + 5)) {
        setErrors({
          ...errors,
          preferredAge: "Max age must be within 5 years of your age."
        });
        return false;
      } else if (formData.preferredAgeMin && (formData.preferredAgeMin > formData.preferredAgeMax)) {
        setErrors({
          ...errors,
          preferredAge: "Min age cannot be greater than max age."
        });
        return false;
      } else {
        setErrors({
          ...errors,
          preferredAge: ""
        });;
      }
    } else {
      setErrors({
        ...errors,
        preferredAge: "Max age must be between 13 and 120."
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddressVerified && validatePreferredGenders() && validatePreferredAgeRange() && Object.values(errors).every(error => error === "")) {
      onSubmit(formData);
    }
  };

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
            label="State Code"
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
            label="Zip Code"
            variant="outlined"
            name="zip"
            type="number"
            value={formData.zip}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.zip)}
            helperText={errors.zip}
          />
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckAddress}
              disabled={isVerifyingAddress}
            >
              {isVerifyingAddress ? "Checking..." : "Check Address"}
            </Button>
          </Box>
          {isAddressVerified && (
            <Typography color="success" variant="body2" align="center" sx={{ mt: 1 }}>
              Address Verified!
            </Typography>
          )}

          <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            Upload Profile Picture (Optional)
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
              error={Boolean(errors.preferredAge)}
              helperText={errors.preferredAge}
            />
            <TextField
              label="Preferred Age Max"
              variant="outlined"
              name="preferredAgeMax"
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
              error={Boolean(errors.preferredAge)}
              helperText={errors.preferredAge}
            />
          </Box>

          <Box display="flex" justifyContent="center" marginTop={3}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginRight: 2 }}
              disabled={!isAddressVerified || Object.values(errors).some(error => error !== "")}
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