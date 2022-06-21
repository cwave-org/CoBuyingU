import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, } from "@fortawesome/free-solid-svg-icons";

export default function Commentlist({ commentObj, isOwner, detailObj, qnaObj, isOpener }) {
  const onCommentDeleteClick = async (event) => {
    if (isOwner) {
      event.preventDefault();
      const ok = window.confirm("이 댓글을 삭제하시겠습니까?");
      if (ok) {
        await dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").doc(`${commentObj.id}`).delete();
      }
    }
    else {
      window.confirm("You don't have permission.");
    }
  };

  /*const CommentDelete = async (event) => {
    await dbService.doc(`nweets/${nweetObj.id}`).collection("comments").doc(`${commentObj.id}`).delete();
  };
*/
  const CommentDelete = () => {
    dbService.doc(`startlist/${detailObj.id}`).collection("QnA").doc(`${qnaObj.id}`).collection("comments").doc(`${commentObj.id}`).delete();
  };

  return (

    <div>
      <div className="detaillist_comment1">
        {isOpener ? (
          <div className="detaillist_comment2">
            <div className="detaillist_qnacontent">
              <img width="9%" src="img/chong.png"></img>
              <b className="detaillist_chong">총대</b> &nbsp; {commentObj.text}
              {isOwner && (
                <span className="detaillist_trashbtn" onClick={onCommentDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} color={"#4B59A8"}/>
                </span>
              )}
            </div>
          </div>
            ) : (
            <span className="detaillist_qnacontent">
              <img width="8%" src="img/noonsong.gif"></img>
              <b>{commentObj.userName}</b> &nbsp; {commentObj.text}
              {isOwner && (
                <span className="detaillist_trashbtn" onClick={onCommentDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} color={"#4B59A8"}/>
                </span>
              )}
            </span>
        )}
          </div>
      
    </div>

      );
};