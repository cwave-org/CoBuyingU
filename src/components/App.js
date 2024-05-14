import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService, dbService } from "../fbase";
import { deleteUser } from "firebase/auth";
import { Link } from "react-router-dom";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });

        var email = user.email;
        var emailIndex = email.indexOf("@") + 1;
        var emailform = email.substring(emailIndex);
        if (emailform !== "sookmyung.ac.kr") {
          deleteUser(user);
          setUserObj(null);
          alert("숙명 메일로만 로그인이 가능합니다.");
        } else {
        }
      } else { 
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj} 
          className="body_box"
        />
      ) : (
        <div className="ini">
          <img id="rotating_img" width="80%" src="img/logo4.png"></img>
        </div>
      )}
    </>
  );
}

export default App;
