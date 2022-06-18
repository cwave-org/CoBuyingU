import React from "react";
import { dbService } from "../fbase";
import Comment from "./Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, } from "@fortawesome/free-solid-svg-icons";

export default function QnA({ qnaObj, isOwner, userObj, detailObj, bucket }) {
  console.log(qnaObj.text);
  const onQnADeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).delete();
      bucket = false;
    }
  }


  return (
    <div>
      <div>
        <div>
          <div className="detaillist_qna_tras">
            <div>
              <b>{qnaObj.userName}님의 질문</b>
            </div>
            

            <div >
              {isOwner && (
                <div>
                  <span onClick={onQnADeleteClick}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </div>
              )}
            </div>

          </div>
          <div className="detaillist_qna_box">
          {qnaObj.text}
          </div>
          


        </div>
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