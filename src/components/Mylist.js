import React from "react";
import { useNavigate } from "react-router-dom";

const Mylist = ({ listObj, isOwner, creatorId }) => {
  const navigation = useNavigate();
  const onShowlist = () => {
    navigation("/itemlist", {
      replace: false,
      state: { buyerindex: listObj.randomidx, filename: listObj.itemname },
    });
  };
  const onShowdetailClick = () => {
    navigation(`/selling/detail/${listObj.id}`, {
      replace: false,
      state: { detailObj: listObj },
    });
  };

  return (
    <>
      <div className="Itemclass">
          <span className="myitem" onClick={onShowdetailClick}>
            {`${listObj.itemname}`}
          </span>
          <span className="myitemshow" onClick={onShowlist}>
              참여자 목록 보기
          </span>
      </div>
    </>
  );
};
export default Mylist;
