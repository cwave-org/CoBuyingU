import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Myjoinlist = ({ listObj, isOwner }) => {
    console.log("join");
    const [newList, setNewList] = useState(listObj.text);

    let navigate = useNavigate();

    const onShowdetailClick = () => {
        navigate("/selling/detail", { replace: false, state: { detailObj: listObj } });
    }

    return (
        <>
            <div className="Itemclass">
                {isOwner ? (
                    <>
                        <div>
                            <h1>주인</h1>
                            <h4>품목 이름: {`${listObj.itemname}`}</h4>
                        </div>
                        <div>
                            <button className="detaillist show Btn" onClick={onShowdetailClick}>
                                해당 공구 자세히보기
                            </button>
                        </div>
                    </>
                ) : (<></>)}
            </div>
        </>
    );
};
export default Myjoinlist;