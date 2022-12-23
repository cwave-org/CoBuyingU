import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import BuyingForm from "../routes/BuyingForm";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import SellingForm from "../routes/SellingForm";
import Navigation from "./Navigation";
import Detaillist from "../routes/Detaillist";
import Itemlist from "../routes/Itemlist";
import Buydetaillist from "../routes/Buydetaillist";
import JoinDone from "../routes/JoinDone";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <div
        style={{
          alignItems: "center",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route exact path="/" element={<Home userObj={userObj} />} />
              <Route
                exact
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              />
              <Route
                exact
                path="/buying"
                element={<BuyingForm userObj={userObj} />}
              />
              <Route
                exact
                path="/selling"
                element={<SellingForm userObj={userObj} />}
              />
              {/*<Route exact path="/selling/edit" element={<EditForm userObj={userObj} />} />*/}

              <Route
                exact
                path="/itemlist"
                element={<Itemlist userObj={userObj} />}
              />
              <Route exact path="/buying/detail" element={<Buydetaillist />} />
              <Route
                exact
                path="/itemlist"
                element={<Itemlist userObj={userObj} />}
              />
              <Route exact path="/buying/done" element={<JoinDone />} />
              {/* <Route path="*" element={<Home userObj={userObj} />} /> */}
            </>
          ) : (
            <>
              <Route exact path="/" element={<Home userObj={null} />} />
              <Route
                exact
                path="/selling/detail/:id"
                element={<Detaillist userObj={null} />}
              />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};
export default AppRouter;
