import { useEffect } from "react";

export default function Kakao({detailObj, url}){
  useEffect(()=>{
    window.Kakao.Link.sendCustom(
      {
      templateId: 78627,
      templateArgs: {
        // 'THU' : detailObj.itemname,
        'item': detailObj.itemname,
        // 'price':detailObj.price,
        'deadline':detailObj.deadline,
        'detail':url,
        }
      }
    )   
  },[])
  return(
    <></>
  );
}