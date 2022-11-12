import React, { useRef, useState } from "react";
import styled from "styled-components";
import PhotoLayout from "./PhotoLayout";
const Container=styled.div`
    border: 3px solid #F6F6F6;
    border-radius: 10px;
    background-color:  #F6F6F6;
`;
const BtnCon=styled.div`
    margin:auto;
    justify-content: space-between;
`;
const Btn=styled.button`
    /* margin: auto; */
    width: 100%;
    background-color: #D9D9D9;
    border-radius:5px;
    color: #5b5b5b;
`;
const AddPhoto=()=>{
    const [detail,setDetail]=useState([<PhotoLayout/>]);
    const addCom=()=>{
        if(detail.length>=3){
            window.alert('품목당 상세 설명은 세개까지 가능합니다.');
        }else{
            setDetail(detail.concat(<PhotoLayout/>));
        }        
    }
   
    return (
        <Container>
            <div>상품 A 상세 설명</div>
            {detail}
            <BtnCon>
            <Btn onClick={addCom}>사진추가</Btn>

            </BtnCon>
        </Container>
    );

}

export default AddPhoto;