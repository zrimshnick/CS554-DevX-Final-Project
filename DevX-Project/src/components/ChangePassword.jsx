import "../App.css";
import "./Auth.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doChangePassword } from "../firebase/FirebaseFunctions";

function ChangePassword() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    const { currentPassword, newPasswordOne, newPasswordTwo } =
      e.target.elements;

    if (newPasswordOne.value !== newPasswordTwo.value) {
      setPwMatch("New Passwords do not match");
      return false;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        newPasswordOne.value
      );
    } catch (e) {
      alert(e);
    }
  };

  if (currentUser.providerData[0].providerId === "password") {
    return (
      <div className="Auth-form-container">
        <h2 className="Auth-form-header">Change Password</h2>
        {pwMatch && <div className="Auth-form-error">{pwMatch}</div>}
        <form className="Auth-form" onSubmit={submitForm}>
          <input
            className="Auth-input"
            name="currentPassword"
            id="currentPassword"
            type="password"
            placeholder="Current Password"
            autoComplete="off"
            required
          />
          <input
            type="password"
            name="newPasswordOne"
            id="newPasswordOne"
            required
            placeholder="Password"
            className="Auth-input"
          />
          <input
            type="password"
            name="newPasswordTwo"
            id="newPasswordTwo"
            required
            placeholder="Confirm Password"
            className="Auth-input"
          />
          <button
            type="submit"
            id="submitButton"
            name="submitButton"
            className="Auth-button"
          >
            Update Password
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2>
          {currentUser.displayName}, You are signed in using a Social Media
          Provider, You cannot change your password
        </h2>
      </div>
    );
  }
}

export default ChangePassword;
