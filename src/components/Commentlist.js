import { dbService } from "../fbase";


export default function Commentlist({commentObj, isOwner,detailObj,qnaObj}) {
  const onCommentDeleteClick = async (event) => {
    if(isOwner){
      event.preventDefault();
      const ok = window.confirm("Are you sure you want to delete this nweet?");
      if (ok) {
        await dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").doc(`${commentObj.id}`).delete();
      }
    }
    else{
      window.confirm("You don't have permission.");
    }
  };

  /*const CommentDelete = async (event) => {
    await dbService.doc(`nweets/${nweetObj.id}`).collection("comments").doc(`${commentObj.id}`).delete();
  };
*/
const CommentDelete =() => {
  dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").doc(`${commentObj.id}`).delete();
};

  return (
    <div>
      <div>
        <label>
          {commentObj.text} 
        </label>

        <div>
          <p>{commentObj.userName}의 답변</p>
        </div>

        <button onClick={onCommentDeleteClick}>
            삭제
        </button>
      </div>


      <div>
        
      </div>
    </div>
);
};