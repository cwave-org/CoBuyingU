import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import Comment from "./Comment";

export default function QnA({qnaObj, isOwner,userObj, detailObj}) {
    const onQnADeleteClick = async () => {
      const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
          await dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).delete();
        }
      }

  
    return (
      <div>
        <div>
          <div>
              <p>{qnaObj.userName}님의 질문입니다.</p>
              <p>{qnaObj.text}</p>
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
          />
        </div>
      </div>         
  );

};