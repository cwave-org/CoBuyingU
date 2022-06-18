import React from "react";
import { authService, firebaseInstance } from "../fbase";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    provider = new firebaseInstance.auth.GoogleAuthProvider();
    await authService.signInWithPopup(provider);
  };
  return (
    <div className="formbox">
      <div>
        <img
          width="100%"
          src="/img/loginBackground2.png"
          onClick={onSocialClick}
        />
      </div>
    </div>
  );
};
export default Auth;
