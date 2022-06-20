import React from "react";
import { dbService } from "../fbase";
import Comment from "./Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

export default function QnA({ qnaObj, isOwner, userObj, detailObj, bucket }) {
  console.log(qnaObj.text);
  const onQnADeleteClick = async () => {
    const ok = window.confirm("정말 삭제하실 건가요??");
    if (ok) {
      async function deleteCollection(dbService, collectionPath) {
        const collectionRef = dbService.collection(collectionPath);
        const query = collectionRef;
        //debugger
        return new Promise((resolve, reject) => {
          deleteQueryBatch(dbService, query, resolve).catch(reject);
        });
      }
      
      async function deleteQueryBatch(dbService, query, resolve) {
        const snapshot = await query.get();
      
        const batchSize = snapshot.size;
        if (batchSize === 0) {
          // When there are no documents left, we are done
          resolve();
          return;
        }
      
        // Delete documents in a batch
        const batch = dbService.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(dbService, query, resolve);
        });
      }
      deleteCollection(dbService, `startlist/${detailObj.id}/QnA/${qnaObj.id}/comments`)
      await dbService
        .doc(`startlist/${detailObj.id}`)
        .collection("QnA")
        .doc(`${qnaObj.id}`)
        .delete();
      bucket = false;
    }
  };

  return (
    <div>
      <div>
        <div>
          <div className="detaillist_qna_tras">
            <div>
              <b>{qnaObj.userName}님의 질문</b>
            </div>

            <div>
              {isOwner && (
                <div>
                  <span onClick={onQnADeleteClick}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="detaillist_qna_box">{qnaObj.text}</div>
        </div>
      </div>

      <div>
        <Comment userObj={userObj} qnaObj={qnaObj} detailObj={detailObj} />
      </div>
    </div>
  );
}
