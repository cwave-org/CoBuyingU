import React from "react";
import { dbService, storageService } from "../fbase";
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

  return (
    // className 뭐라 할까 css할때 헷갈릴까봐 아직 안바꿨어
    <div className="nweet">
      <>
        <div onClick={onDetaillistClick}>
           {listObj.attachmentUrl && 
          <img src={listObj.attachmentUrl} />}
          <div className="name">{`${listObj.item}공구☞ ${listObj.itemname}`}</div>
          <div className="deadline">{`${listObj.deadline}까지`}</div>
        </div>
      </>
    </div>
  );
};
export default Nweet;
