import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
/* import { generateUsername } from "unique-username-generator"; */

async function doCreateUserWithEmailAndPassword(email, password) {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  //await updateProfile(auth.currentUser, { displayName: displayName });
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn() {
  const auth = getAuth();
  let socialProvider = new GoogleAuthProvider();
  /* await signInWithPopup(auth, socialProvider); */

  try {
    // Sign in with Firebase
    const result = await signInWithPopup(auth, socialProvider);
    const user = result.user;

    const userData = {
      firstName: user.displayName.split(" ")[0] || "First",
      lastName: user.displayName.split(" ")[1] || "Last",
      email: user.email,
      /* age: 0, // Default age, or add age input in your app later
      bio: "", // Default bio */
    };

    // Create MongoDB user
    try {
      const response = await fetch("http://localhost:3000/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating user in MongoDB:", error);
        console.log("did not create user in Mongo");
        /* alert("Error saving user data. Please try again."); */
      } else {
        console.log(
          "User successfully created in MongoDB:",
          await response.json()
        );
      }
    } catch (mongoError) {
      console.error("Error connecting to MongoDB API:", mongoError);
      alert("Could not connect to the server. Please try again later.");
    }
  } catch (firebaseError) {
    console.error("Error signing in with Google:", firebaseError);
    alert("Google Sign-In failed. Please try again.");
  }
}

async function doPasswordReset(email) {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  const auth = getAuth();
  await signOut(auth);
}

export {
  doChangePassword,
  doPasswordReset,
  doSignOut,
  doSocialSignIn,
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
};
