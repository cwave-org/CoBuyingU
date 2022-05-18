import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dbService } from "../fbase";

const Myscrap = ({ listObj, userObj }) => {
    const [Scrap, setScrap] = useState("");
    const [Scraps, setScraps]= useState([]);

    useEffect(() => {
        dbService.doc(`startlist/${listObj.id}`).collection("scrap").onSnapshot((snapshot) => {
            const checkArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setScraps(checkArray);
          });
      }, []);

      if (dbService.doc(`startlist/${listObj.id}`).collection("scrap").doc()===dbService.doc(`startlist/${listObj.id}`).collection("scrap").doc(userObj.uid)){

      }

    return (
        <>
            <div className="Itemclass">
            
                <>
                    <div>
                        <h4>품목 이름: {`${listObj.itemname}`}</h4>
                    </div>
                    
                </>  
            </div>
        </>
    );
};
export default Myscrap;