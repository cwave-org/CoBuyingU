import React from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Nweet = ({ listObj, isOwner }) => {
  let navigate = useNavigate();
  const onDetaillistClick = () => {
    // const detailObj = "init";
    navigate("/selling/detail", {
      replace: false,
      state: { detailObj: listObj },
    });
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this list?");
    if (ok) {
      await dbService.doc(`startlist/${listObj.id}`).delete();
      await storageService.refFromURL(listObj.attachmentUrl).delete();
    }
  };
  return (
    // className 뭐라 할까 css할때 헷갈릴까봐 아직 안바꿨어
    <div className="nweet">
      <>
        <div>
          <h4>{`${listObj.item}공구☞ ${listObj.itemname}`}</h4>
          <h4>{`${listObj.deadline}까지`}</h4>
          <button className="detaillist Btn" onClick={onDetaillistClick}>
            자세히 보기
          </button>
          <br></br>
          {listObj.attachmentUrl && <img src={listObj.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          )}
        </div>
      </>
    </div>
  );
};
export default Nweet;
