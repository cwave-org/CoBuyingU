import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

export default function Commentlist({
  commentObj,
  isOwner,
  detailObj,
  qnaObj,
  isOpener,
}) {
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

  const CommentDelete = () => {
    dbService
      .doc(`startlist/${detailObj.id}`)
      .collection("QnA")
      .doc(`${qnaObj.id}`)
      .collection("comments")
      .doc(`${commentObj.id}`)
      .delete();
  };

  return (
    <div>
      <div className="detaillist_comment1">
          {isOpener?(
            <span className="detaillist_comment2">
             <b>총대</b>{' '}{commentObj.text}
            </span>
            
          ):(
          <span className="detaillist_qnacontent">
          <img width="8%" src="img/noonsong.gif"></img>
          {' '}{commentObj.text}
        </span>
          )}
          
        </div>
        <div className="detaillist_comment3">
          {isOwner&&(
            <span onClick={onCommentDeleteClick}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
          )}
        </div>
      </div>
  );
}
