import React from "react";
import { useNavigate } from "react-router-dom";


const Mylist = ({ listObj, isOwner }) => {
    const navigation = useNavigate();
    const onShowlist = () => {
        navigation("/itemlist", { replace: false, state: { buyerindex : listObj.randomidx , filename : listObj.itemname} });
    }
    
    return (
        <>
            <div className="Itemclass">
                {isOwner ? (
                    <>  
                        <div>
                            <h4>품목 이름: {`${listObj.itemname}`}</h4>
                        </div>
                        <button onClick={onShowlist}>
                            공구 참여자 목록 보기
                        </button>
                    </>
                ) : (<></>)}
            </div>
        </>
    );
};
export default Mylist;