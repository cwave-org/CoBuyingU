import { useEffect } from "react";

export default function Kakao({detailObj}){

  useEffect(()=>{
    window.Kakao.Link.sendCustom(
      {
      templateId: 78627,
      templateArgs: {
        'THU' : detailObj.attachmentUrl,
        'item': detailObj.item,
        'price':detailObj.price,
        'deadline':detailObj.deadline,
      }
    }
    )
    
  },[])
    // const img='public/img/chong.png';
  return(
    <></>
  );
}