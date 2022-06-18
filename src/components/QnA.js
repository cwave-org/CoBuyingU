import React from "react";
import { dbService } from "../fbase";
import Comment from "./Comment";

export default function QnA({qnaObj, isOwner,userObj, detailObj,bucket}) {
  console.log(qnaObj.text);
    const onQnADeleteClick = async () => {
      const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
          await dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).delete();
          bucket =false;
        }
      }

  
    return (
      <div>
        <div>
          <div>
              <h3>{qnaObj.userName}님의 질문: {qnaObj.text}</h3>
              <h4>{qnaObj.text}</h4>
          </div>
        
          {isOwner && (
              <div>
                  <div>
                    <button onClick={onQnADeleteClick}>
                     삭제
                    </button>
                  </div>
            </div>
            )}


          
        </div>

        <div>
          <Comment
            userObj={userObj}
            qnaObj={qnaObj}
            detailObj={detailObj}
          />
        </div>
      </div>         
  );

};