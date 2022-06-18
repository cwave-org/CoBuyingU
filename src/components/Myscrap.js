import { faExpeditedssl } from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dbService } from "../fbase";

const Myscrap = ({ listObj, userObj}) => {
    const [bucket, setBucket] = useState(false);
    const [scraps, setScraps]= useState([]);
    console.log(listObj.id);
    useEffect(() => {
        dbService.doc(`startlist/${listObj.id}`).collection("scrap").onSnapshot((snapshot) => {
            const checkArray = snapshot.docs.map((doc) => ({
              id: userObj.uid,
              ...doc.data(),
            }));
            setScraps(checkArray);
           
          });
      } , []);

      

    useEffect(() => {
            dbService.doc(`startlist/${listObj.id}`).collection("scrap").get()
      .then((docs) => {
        docs.forEach((doc) => {
          if(doc.id===userObj.uid){
          if (doc.exists) {
            setBucket(!bucket);
          }
        }
        });
    });
 } , []);

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


    return(
<>
            <div className="Itemclass">
                {bucket ? (
                    <>
                        <div>
                            <h4>품목 이름: {`${listObj.itemname}`}</h4>
                        </div>
                    </>
                ) : (<></>)}
            </div>
        </>
    )
};
    
    
export default Myscrap;