import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


export default function Commentlist({
  commentObj,
  isOwner,
  detailObj,
  qnaObj,
}
) {
 


  const onCommentDeleteClick = async (event) => {
    if (isOwner) {
      event.preventDefault();
      const ok = window.confirm("이 댓글을 삭제하시겠습니까?");
      if (ok) {
        await dbService
          .doc(`startlist/${detailObj.id}`)
          .collection("QnA")
          .doc(`${qnaObj.id}`)
          .collection("comments")
          .doc(`${commentObj.id}`)
          .delete();
      }
    } else {
      window.confirm("You don't have permission.");
    }
  };

  return (
    <div>
      <div className="detaillist_qna_box">
          {isOwner?(
            <span className="detaillist_qnacontent">
             <b>총대</b>{' '}{commentObj.text}
             <span className="etaillist_trashbtn" onClick={onCommentDeleteClick}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
            </span>
            
          ):(
          <span className="detaillist_qnacontent">
          <img width="8%" src="img/noonsong.gif"></img>
          {' '}{commentObj.text}
        </span>
          )}
          
        </div>
      </div>
  );
}
