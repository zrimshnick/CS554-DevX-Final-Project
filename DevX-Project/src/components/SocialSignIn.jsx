import { doSocialSignIn } from "../firebase/FirebaseFunctions";
/* import googleIcon from "../../public/img/googleIcon.png"; */
import googleIcon from "../img/googleIcon.png";
import "./Auth.css";

const SocialSignIn = () => {
  const socialSignOn = async () => {
    try {
      await doSocialSignIn();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="Auth-social-container">
      <div className="Auth-social-header">Or sign up with Google</div>
      <img
        className="Auth-social-img"
        onClick={socialSignOn}
        alt="Google signin"
        src={googleIcon}
      />
    </div>
  );
};

export default SocialSignIn;
