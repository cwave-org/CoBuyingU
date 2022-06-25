import React from "react";
import { authService, dbService, firebaseInstance } from "../fbase";

const Auth = ({userObj}) => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    provider = new firebaseInstance.auth.GoogleAuthProvider();
    await authService.signInWithPopup(provider);
    /*await dbService.collection("user").add(userObj);
    console.log(userObj);*/
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
