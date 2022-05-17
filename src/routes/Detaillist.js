import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
const Detaillist=({userObj,checkObj})=>{
    const [check, setCheck] = useState(false);
    const [checks, setChecks] = useState([]);
    const navigate=useNavigate();
    const onJoinlistClick = () => {
        navigate("/buying", { replace: false, state: { detailObj: detailObj } });
    }
    const onShowlistClick = () => {
        navigate("/itemlist", { replace: false, state: { detailObj: detailObj } });
    }
    
    const location = useLocation();
    const {detailObj}=location.state;

    /*let checkState = async(event) => {
        let checkObj = {
            check:checked,
            creatorId: detailObj.uid,
            name: detailObj.name,
            itemlist : detailObj.itemname,
            price : detailObj.price,
            deadline : detailObj.deadline,
            etc : detailObj.etc,
            account : detailObj.account,
          };
        
        
        await dbService.collection("mylist").add(checkObj);
    }*/

    useEffect(() => {
        dbService.doc(`startlist/${detailObj.id}`).collection("scrap").onSnapshot((snapshot) => {
            const checkArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setChecks(checkArray);
          });
      }, []);

      const onSubmitCheck = async (event) => {
        setCheck(!check);
        event.preventDefault();
        const checkObj= {
            check:check,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          userName:userObj.displayName,
        }

        //await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").add(checkObj);
        await dbService.collection("startlist").doc(detailObj.id).collection("scrap").doc(userObj.uid).set(checkObj);

    }

    const onCancleCheck = async (event) =>{
        event.preventDefault();
        setCheck(!check);
        await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).update({
          check:check,
        });
        //setEditing(false);
      };

    /*const checkScrab = async(event) => {
        setCheck(!check);

        const checkObj = {
            check:checked,
            //creatorId: detailObj.uid,
            name: detailObj.name,
            itemlist : detailObj.itemname,
            price : detailObj.price,
            deadline : detailObj.deadline,
            etc : detailObj.etc,
            account : detailObj.account,
          };
        
        
        
        event.preventDefault();
        //await dbService.collection("mylist").add(checkObj);

        if(checked===true){
            await dbService.doc(`mylist/${checkObj.uid}`).update({
                check:checked,
              });
        }
        await dbService.doc(`mylist/${detailObj.id}`).add({
          //text: newNweet,
          checked:(!checked)
        });
      
    }*/

    return(
        <>
            <div>
                <h3>공구 명 : {detailObj.name}</h3>
                <h3>상품 명 : {detailObj.itemname}</h3>
                <h3>가격 : {detailObj.price}</h3>
                <h3>마감기한 : {detailObj.deadline}</h3>
                <h3>기타사항 : {detailObj.etc}</h3>
                <h3>계좌 : {detailObj.account}</h3>
            </div>
            <div>
                <button className="detaillist submit Btn" onClick={onJoinlistClick}>
                    공구 참여하기
                </button>
                <button className="detaillist show Btn" onClick={onShowlistClick}>
                    공구 참여자 목록 보기
                </button>
            </div>
            <div>
                {check ? (
                    <>
                    <input type="checkbox" 
                    onClick={onCancleCheck}
                    ></input>
                    </>
                ):(
                    <>
                    <input type="button" 
                    onClick={onSubmitCheck}

                    ></input>
                    </>
                )}
                

            </div>
        </> 
    );
};
export default Detaillist;