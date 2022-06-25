import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


export default function Commentlist({
  commentObj,
  isOwner,
  detailObj,
  qnaObj,
  isOpener,
}
) {
 
  const onCommentDeleteClick = async (event) => {
    if (isOwner) {
      event.preventDefault();
      const ok = window.confirm("이 댓글을 삭제하시겠습니까?");
      if (ok) {
        await dbService.doc(`startlist/${detailObj}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").doc(`${commentObj.id}`).delete();
      }
    }
    else {
      window.confirm("You don't have permission.");
    }
  };
  return (
    <>
        {isOpener?(
          <>
              <div className="comment_retext">
              <img  width="12%" src="img/chong.png"></img>
                <b>총대</b>{' '}{commentObj.text}        
              </div>
             
                {isOwner && (
              <span className="comment_trashbtn" onClick={onCommentDeleteClick}>
              <FontAwesomeIcon icon={faTrash} color={"#4B59A8"} />
            </span>)
            }
          </>
                    
          ):(
            <>
          <div className="comment_retext">
          <img width="11%" src="img/noonsong.gif"></img>
          <b>{commentObj.userName}</b> &nbsp; {commentObj.text}
        </div>
        {isOwner && (
            <span className="comment_trashbtn" onClick={onCommentDeleteClick}>
            <FontAwesomeIcon icon={faTrash} color={"#4B59A8"} />
          </span>)
          }
        </>
          )}       
    </>
  );
};