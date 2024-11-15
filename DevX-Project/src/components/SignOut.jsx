import React from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";

const SignOutButton = () => {
  return (
    <button className="Auth-signOutButton" type="button" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
