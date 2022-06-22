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
<script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
