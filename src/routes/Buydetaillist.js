import { useNavigate } from "react-router-dom";
import React from "react";
import { useLocation } from "react-router-dom";
const Buydetaillist=()=>{
    const navigate=useNavigate();
    const location = useLocation();
    const {detailObj}=location.state;

    return(
        <>
            <div>
                <h3>이름 : {detailObj.name}</h3>
                <h3>전화번호 : {detailObj.phonenumber}</h3>
                <h3>수량 : {detailObj.count}</h3>
                <h3>사이즈 : {detailObj.size}</h3>
                <h3>주소 : {detailObj.address}</h3>
                <h3>입금자명 : {detailObj.account_name}</h3>
                <h3>입금일자 : {detailObj.account_date}</h3>
                <h3>환불계좌 : {detailObj.account_re}</h3>
            </div>
            
        </> 
    );
};
export default Buydetaillist;