import { useEffect } from "react";

export default function Kakao({detailObj}){
  useEffect(()=>{
    console.log(detailObj.id);
    window.Kakao.Link.sendCustom(
      {
      templateId: 78627,
      templateArgs: {
        'THU' : detailObj.attachmentUrl,
        'item': detailObj.item,
        'price':detailObj.price,
        'deadline':detailObj.deadline,
        'detail':detailObj.id,
        }
      }
    )   
  },[])
  return(
    <></>
  );
}