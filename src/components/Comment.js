import { useEffect, useState } from "react";
import { dbService, firebaseInstance } from "../fbase";
import Commentlist from "./Commentlist";
import { useParams } from "react-router-dom";

const Comment= ({ userObj,qnaObj,detailObj,isOpener }) => {
  const {id} = useParams();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const timestamp=firebaseInstance.firestore.FieldValue.serverTimestamp;
    useEffect(() => {
      dbService.doc(`startlist/${id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").orderBy('createdAt').onSnapshot((snapshot) => {
          const commentArray = snapshot.docs.map((doc) => (
            {
            id: doc.id,
            ...doc.data(),
          }));
          setComments(commentArray);
        });
    }, []);
  
      const onSubmitComment = async (event) => {
          event.preventDefault();
          await dbService.doc(`startlist/${id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").add({
            text: comment,
            createdAt: timestamp(),
            creatorId: userObj.uid,
            userName:userObj.displayName,
          });
          setComment("");
      }

    const onChangeComment = (event) => {
        const {
          target: { value },
        } = event;
        setComment(value);
    };
      
    return (
          <div>
              <span>
              <form onSubmit={onSubmitComment}>
                  <input
                  className="comment_text"
                    type="text"
                    placeholder="답변을 달아주세요"
                    value={comment}
                    onChange={onChangeComment}
                  />
                  <button type="submit" className="upload_Btn">
                  💬
                  </button>
              </form>
              </span>
              {comments.map((comment) => (
                  <Commentlist
                    userObj={userObj.uid}
                    key={comment.id}
                    commentObj={comment}
                    isOwner={comment.creatorId === userObj.uid}
                    detailObj={id}
                    qnaObj={qnaObj}
                    isOpener={isOpener===comment.creatorId}
                  />
                ))}   
            <hr></hr>
          </div>
  );
};
export default Comment;