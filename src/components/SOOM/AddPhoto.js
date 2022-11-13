import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PhotoLayout from "./PhotoLayout";
const Container=styled.div`
    border: 3px solid #F6F6F6;
    border-radius: 10px;
    background-color:  #F6F6F6;
`;
const BtnCon=styled.div`
    /* margin:0 3px; */
    justify-content: space-around;
    display: flex;
`;
const Btn=styled.button`
    width: 48%;
    background-color: #D9D9D9;
    border-radius:5px;
    color: #5b5b5b;
`;
const AddPhoto=(props)=>{
    const [id,setId]=useState(1);
    const [data,setData]=useState([]);
    const [detail,setDetail]=useState([<PhotoLayout key={id} id={id} setData={setData} data={data}/>]);
    const onClickAdd=()=>{
        setId(id+1);
        if(id>=3){
            window.alert('품목당 상세 설명은 세개까지 가능합니다.');
        }else{
            setDetail(detail.concat(<PhotoLayout key={id+1} id={id+1} setData={setData} data={data} />));
        }
    }
    const onClickDone=()=>{
        props.setEach(data);
    }
    return (
        <Container>
            <div>상품 A 상세 설명 (최대 3개) </div>
            {detail}
            <BtnCon>
                <Btn onClick={onClickAdd}>사진추가</Btn>
                <Btn onClick={onClickDone}>완료</Btn>
            </BtnCon>
        </Container>
    );

}

export default AddPhoto;