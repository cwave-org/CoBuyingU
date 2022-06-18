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

      
      const onSubmitCheck = async (event) => {
        setCheck(!check);
        event.preventDefault();

        await dbService.collection("startlist").doc(detailObj.id).collection("scrap").doc(userObj.uid).set(checkObj);
        await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).update({
            check:(!check),
          });
          console.log(dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).id);
          console.log(dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc());
          dbService.collection("startlist").doc(detailObj.id).collection("scrap").doc(userObj.uid).get(checkObj);
          console.log(!check);
    };

    const onCancleCheck = async (event) =>{
        event.preventDefault();
        setCheck(!check);
        await dbService.doc(`startlist/${detailObj.id}`).collection("scrap").doc(userObj.uid).delete();
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

      const qnaObj= {
        text: qna,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        userName:userObj.displayName,
    }
    
    const [bucket, setBucket] = useState(true);
    
      useEffect(() => {
        dbService.doc(`startlist/${detailObj.id}`).collection("QnA").get()
  .then((docs) => {
    docs.forEach((doc) => {
      console.log(doc.data());
      console.log(doc.exists);
      console.log(bucket);

      if (doc.exists) {
        setBucket(!bucket);
        console.log(doc.exists);
      }
      else{
        setBucket(bucket);
      }
    
    console.log(bucket);
    });
});
} , []);
      const QnAonSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("startlist").doc(detailObj.id).collection("QnA").doc(userObj.uid).set(qnaObj);
        
        dbService.collection("startlist").doc(detailObj.id).collection("scrap").doc(userObj.uid).get({
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

            <h2>📢 공지사항</h2>
            <br></br>

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
                < a href={detailObj.link}>
                <img 
                src="img/kakaotalk.png"
                height={50}
                width={50}/>
                </a>
            </div>

            <div>
                <p>♥무엇이든지 물어보세요♥</p>
                <>
                <div>
{bucket? 
                    
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
                    :
                    <div>"🙏🏼원활한 QnA를 위해 인당 1 질문만 할수🙏🏼"</div>
                }
                

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