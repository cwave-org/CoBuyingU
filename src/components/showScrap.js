import { faExpeditedssl } from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dbService } from "../fbase";

const showScrap = ({ listObj, userObj ,Id2}) => {
    const [Scrap, setScrap] = useState("");
    const [scraps, setScraps]= useState([]);
    const [ex,setEx]=useState("");

    useEffect(() => {
        dbService.doc(`startlist/${listObj.id}`).collection("scrap").onSnapshot((snapshot) => {
            const checkArray = snapshot.docs.map((doc) => ({
              id: userObj.uid,
              ...doc.data(),
            }));
            setScraps(checkArray);
           
          });
      } , []);

    if (dbService.doc(`startlist/${listObj.id}`).collection("scrap").doc().id==Id){
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
        return (
            <p>none</p>
        );
    }
};
    
    
export default showScrap;