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
    <div className="formbox" onClick={onSocialClick}>
        <img
          width="80%"
          src="/img/loginGoogle.png"
        />
        <div className="formbox_logintext">
          <br/>
          클릭하시면, 숙명 구글메일로 로그인한 후 이용할 수 있습니다.<br/>
          원활한 로그인을 위해 인터넷 모바일 앱을 이용해주시기 바랍니다.
        </div>
    </div>
  );
};
export default Auth;
