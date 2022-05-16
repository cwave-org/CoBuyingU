import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Myjoinlist = ({ listObj, isOwner }) => {
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
                            <h4>품목 이름: {`${listObj.randomidx}`}</h4>
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