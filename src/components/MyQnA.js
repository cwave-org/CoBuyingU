import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { useNavigate } from "react-router-dom";

const MyQnA = ({ listObj, userObj }) => {
  const [bucket, setBucket] = useState(false);
  const [myqnas, setMyqnas] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    dbService
      .doc(`startlist/${listObj.id}`)
      .collection("QnA").orderBy('createdAt')
      .onSnapshot((snapshot) => {
        const checkArray = snapshot.docs.map((doc) => ({
          id: userObj.uid,
          ...doc.data(),
        }));
        setMyqnas(checkArray);
      });
  }, []);
  useEffect(() => {
    dbService
      .doc(`startlist/${listObj.id}`)
      .collection("QnA")
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
            <div>
              <span className="myitem" onClick={onClick}>
                품목 이름: {`${listObj.itemname}`}
              </span>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default MyQnA;
