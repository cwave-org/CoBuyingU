import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Mylist = ({ listObj, isOwner,creatorId }) => {
    const [newList, setNewList] = useState(listObj.text);

    let navigate = useNavigate();

    const onShowlistClick = () => {
        navigate("/itemlist", { replace: false, state: { detailObj: listObj } });
    }
console.log(creatorId);
    return (
        <>
            <div className="Itemclass">
                {isOwner ? (
                    <>
                        <div>
                            <h4>품목 이름: {`${listObj.itemname}`}</h4>
                        </div>
                        <div>
                            <button className="detaillist show Btn" onClick={onShowlistClick}>
                                공구 참여자 목록 보기
                            </button>
                        </div>
                    </>
                ) : (<></>)}
            </div>
        </>
    );
};
export default Mylist;