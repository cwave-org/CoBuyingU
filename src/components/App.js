import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { deleteUser } from "firebase/auth";

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
          alert("You can only login using Sookmyung email.");
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
        />
      ) : (
        <img width="100%" src="img/cwave_black.png"></img>
      )}
      <footer className="footer">&copy; CWAVE all rights reserved </footer>
    </>
  );
}

export default App;
