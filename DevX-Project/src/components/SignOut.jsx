import React from "react";
import {Button} from "@mui/material"
import { doSignOut } from "../firebase/FirebaseFunctions";

const SignOutButton = () => {
  return (
    <Button
      type="button"
      onClick={doSignOut}
      variant="contained"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
