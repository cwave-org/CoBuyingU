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
      .collection("QnA")
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

  /*
    if (bucket.id==userObj.uid){
        //console.log(dbService.doc(`startlist/${listObj.id}`).collection("scrap").doc());
        //console.log(creatorId);
        //console.log(Id);
        //dbService.doc(`startlist/${listObj.id}`).collection("scrap").doc(userObj.uid).id==userObj.uid
        console.log(scraps);
        //console.log(scraps[0].id);

    return (
            <div className="Itemclass">
                <>
                
                    <div>
                    <h4>품목 이름: {`${listObj.name}`}</h4> 
                            
                        
                    </div>
                    
                </>  
                
            </div>
    );
                        }
    else{
        //console.log(creatorId);
        console.log(scraps.creatorId);
        //console.log(dbService.doc(`startlist/${listObj.id}`).collection("scrap").doc());
        return (
            
            <p>없어</p>
        );
    }*/

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
