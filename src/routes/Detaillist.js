import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import QnA from "../components/QnA";

const Detaillist=({userObj})=>{
    const [check, setCheck] = useState(false);
    const [checks, setChecks] = useState([]);
    const [qna, setQna] = useState("");
    const [qnas, setQnas] = useState([]);

    const navigate=useNavigate();
    const onJoinlistClick = () => {
        navigate("/buying", { replace: false, state: { detailObj: detailObj } });
    }
    const onShowlistClick = () => {
        navigate("/itemlist", { replace: false, state: { detailObj: detailObj } });
    }
    const checkObj= {
        check:check,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        userName:userObj.displayName,
    }
    const location = useLocation();
    const {detailObj}=location.state;

    useEffect(() => {
        dbService.doc(`startlist/${detailObj.id}`).collection("scrap").onSnapshot((snapshot) => {
            const checkArray = snapshot.docs.map((doc) => ({
              id: userObj.uid,
              
              ...doc.data(),
            }));
            setChecks(checkArray);
          });
      }, []);

      /*useEffect(() => {
        dbService.collection("startlist").doc(`scrap/${userObj.id}`)
        .where("scrap","==",true).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                querySnapshot.forEach((doc)=>{
                    const myobj={
                        ...doc.data(),
                        id: doc.id,
                    }
                    setChecks(prev=>[myobj,...prev]);
            })
            
        })
    }, [])
 } );*/
 
   

      const onSubmitCheck = async (event) => {
        //console.log(dbService.collection("startlist").doc(`scrap/${userObj.id}`));
        setCheck(!check);
        event.preventDefault();
        /*const checkObj= {
            check:check,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          userName:userObj.displayName,
        }*/

        //await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").add(checkObj);
        await dbService.collection("startlist").doc(detailObj.id).collection("scrap").doc(userObj.uid).set(checkObj);
        await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).update({
            check:(!check),
          });
          //console.log(dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc());
          console.log(dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).id);
          console.log(dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc());
          dbService.collection("startlist").doc(detailObj.id).collection("scrap").doc(userObj.uid).get(checkObj);
          console.log(!check);
    };

    const onCancleCheck = async (event) =>{
        event.preventDefault();
        setCheck(!check);
        await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).delete();
        /*await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).update({
          check:(!check),
        });*/
        //console.log(dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc());
        //console.log(dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc().id);
        //setEditing(false);
        console.log(!check);
      };

      useEffect(() => {
        dbService.doc(`startlist/${detailObj.id}`).collection("QnA").onSnapshot((snapshot) => {
            const qnaArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setQnas(qnaArray);
          });
      }, []);

      const QnAonSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("startlist").doc(detailObj.id).collection("QnA").add({
          text: qna,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          checked:false,
          userName:userObj.displayName,
        })
        setQna("");
    };

    const QnAonChange = (event) => {
        const {
          target: { value },
        } = event;
        setQna(value);
    };
      
    return(
                  
        <div>

            <h3>📢 공지사항</h3>

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
                {checkObj.check? (
                    <>
                    <input type="checkbox" 
                    onClick={onCancleCheck}
                    />
                    </>
                ):(
                    <>
                    <input type="button" 
                    onClick={onSubmitCheck}/>
                    </>
                )}
            </div>

            <div>
                <p>♥무엇이든지 물어보세요♥</p>
                <>
                <div>
                    <form onSubmit={QnAonSubmit}>
                        <input 
                            type="text"
                            placeholder="🙏🏼수정은 불가능하세요.🙏🏼"
                            value={qna}
                            onChange={QnAonChange}
                        />

                    <button 
                        type="submit">
                        Upload
                    </button>
                    </form>
                </div>
                </>
            </div>
            <>
            {qnas.map((qna) => (
                 <QnA
                    key={qna.id}
                    qnaObj={qna}
                    isOwner={qna.creatorId === userObj.uid}
                    userObj={userObj}
                    detailObj={detailObj}
                    
               />
              ))}
          </>

          </>
        </div> 
                
    )
};
export default Detaillist;