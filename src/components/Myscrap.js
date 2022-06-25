import { faExpeditedssl } from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Myscrap = ({ listObj, userObj }) => {
  const [bucket, setBucket] = useState(false);
  const navigation = useNavigate();

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

  // 스크랩 기능
  const check = async (event) => {
    setBucket((current) => !current);

    // 스크랩 취소
    await dbService
      .doc(`startlist/${listObj.id}`)
      .collection("scrap")
      .doc(userObj.uid)
      .delete();
  };

  const onClick = () => {
    navigation(`/selling/detail/${listObj.id}`, {
      replace: false,
      state: { detailObj: listObj },
    });
  };

  return (
    <>
      <div className="Itemclass">
        {bucket ? (
          <>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span onClick={onClick} style={{ width: "90%" }}>
                품목 이름: {`${listObj.itemname}`}
              </span>
              <FontAwesomeIcon
                icon={faStar}
                onClick={check}
                size="1x"
                color={"#E4C6F5"}
                style={{ width: "10%" }}
              ></FontAwesomeIcon>
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
