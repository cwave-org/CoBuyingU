import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authService } from "../fbase";

const Navigation = ({ userObj }) => {
  const navigate = useNavigate();
  const logOut = (event) => {
    authService.signOut();
    navigate("/");
  };
  return (
    <>
      <nav>
        <ul style={{ display: "flex", justifyContent: "center" }}>
          <li>
            <Link
              to="/selling"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: 12,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ fontSize: 30 }}>📢</h1>
                <span style={{ fontSize: 10 }}>공구 열기</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              style={{
                alignItems: "center",
                fontSize: 10,
                textDecoration: "none",
              }}
            >
              <img width="200px" src="img/cwave_border.png"></img>
            </Link>
          </li>
          <li>
            {userObj ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <h1 style={{ fontSize: 20, marginRight: 10 }}>⍈</h1>
                    <span style={{ fontSize: 10 }} onClick={logOut}>
                      LogOut
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      fontSize: 10,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 5,
                        alignItems: "center",
                      }}
                    >
                      <img width="30px" src="img/noonsong.gif"></img>
                      <span>&nbsp;Profile</span>
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
                  <h1 style={{ fontSize: 20 }}>⍈</h1>
                  <span>LogIn</span>
                </div>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};
export default Navigation;
