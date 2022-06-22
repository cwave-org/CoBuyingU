import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./style.css";
import "./font.css";
import "./listpage.css";
import "./detaillist.css";
import "./mainpage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./openJoin.css";
import "./mypage.css";

window.Kakao.init('0dac4f0cc838fab4e0aa05850497272f');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
