import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import Commentlist from "./Commentlist";


const Comment= ({ userObj,qnaObj,detailObj }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
      dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").onSnapshot((snapshot) => {
          const commentArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(commentArray);
        });
    }, []);
  
      const onSubmitComment = async (event) => {
          event.preventDefault();
          await dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").add({
            text: comment,
            createdAt: Date.now(),
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
            <div>
              <div className="detaillist_comment">
              <form onSubmit={onSubmitComment}>
                  <input 
                    type="text"
                    placeholder="답변을 달아주세요"
                    value={comment}
                    onChange={onChangeComment}
                  />
        
                  <button type="submit">
                  Upload
                  </button>
              </form>
              </div>

              <>
                {comments.map((comment) => (
                  <Commentlist
                    key={comment.id}
                    commentObj={comment}
                    isOwner={comment.creatorId === userObj.uid}
                    detailObj={detailObj}
                    qnaObj={qnaObj}
                  />
                ))}
              </>
              
            </div>
            <hr></hr>

            <div>
            
          
            </div>
          </div>
  );
};
export default Comment;