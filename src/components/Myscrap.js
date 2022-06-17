import { faExpeditedssl } from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dbService } from "../fbase";

const Myscrap = ({ listObj, userObj }) => {
  const [bucket, setBucket] = useState(false);
  const [scraps, setScraps] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    dbService
      .doc(`startlist/${listObj.id}`)
      .collection("scrap")
      .onSnapshot((snapshot) => {
        const checkArray = snapshot.docs.map((doc) => ({
          id: userObj.uid,
          ...doc.data(),
        }));
        setScraps(checkArray);
      });
  }, []);

  // if (dbService.doc(`startlist/${listObj.id}`).collection("scrap").doc(userObj.uid).get(check)){
  useEffect(() => {
    dbService
      .doc(`startlist/${listObj.id}`)
      .collection("scrap")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.id === userObj.uid) {
            if (doc.exists) {
              setBucket(!bucket);
            }
          }
        });
      });
  }, []);

  const onClick = () => {
    navigation("/selling/detail", {
      replace: false,
      state: { detailObj: listObj },
    });
  };
  return (
    <>
      <div className="Itemclass">
        {bucket ? (
          <>
            <div>
              <h4 onClick={onClick}>품목 이름: {`${listObj.itemname}`}</h4>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Myscrap;
