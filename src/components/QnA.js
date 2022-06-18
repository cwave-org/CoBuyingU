import React from "react";
import { dbService } from "../fbase";
import Comment from "./Comment";

export default function QnA({ qnaObj, isOwner, userObj, detailObj }) {
  const onQnADeleteClick = async () => {
    const ok = window.confirm("정말 이 문의를 삭제하실 건가요?");
    if (ok) {
      await dbService
        .doc(`startlist/${detailObj.id}`)
        .collection("QnA")
        .doc(`${qnaObj.id}`)
        .delete();
    }
  };

  return (
    <div>
      <div>
        <div>
          <h3>
            {qnaObj.userName}님의 질문: {qnaObj.text}
          </h3>
          <h4>{qnaObj.text}</h4>
        </div>

        {isOwner && (
          <div>
            <div>
              <button onClick={onQnADeleteClick}>삭제</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <Comment userObj={userObj} qnaObj={qnaObj} detailObj={detailObj} />
      </div>
    </div>
  );
}
