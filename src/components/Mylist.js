import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Mylist = ({ listObj, isOwner }) => {
    const [newList, setNewList] = useState(listObj.text);
    
    let navigate = useNavigate();
    
    /*
    const onShowlistClick = () => {
        navigate("/itemlist", { replace: false, state: { detailObj: detailObj } });
    }
    const location = useLocation();
    const {detailObj}=location.state;
    */
    return (
        <div className="Itemclass">
            {isOwner ? (
                <div>
                    <h4>품목 이름: {`${listObj.itemname}`}</h4>
                </div>
            ) : (<></>)}

        </div>
    );
};
export default Mylist;