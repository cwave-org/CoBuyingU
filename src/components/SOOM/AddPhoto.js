import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PhotoLayout from "./PhotoLayout";
const Container=styled.div`
    width: 100%;
    margin: auto;
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
    const [detail,setDetail]=useState([<PhotoLayout key={id} id={id} setData={props.setData} data={props.data}/>]);
   
    const onClickAdd=(event)=>{
        event.preventDefault();
        setId(id+1);
        if(id>=3){
            window.alert('품목당 상세 설명은 세개까지 가능합니다.');
        }else{
            setDetail(detail.concat(<PhotoLayout key={id+1} id={id+1} setData={props.setData} data={props.data} />));
        }
    }
    // const onClickDone=()=>{
    //     props.setEach(props.data);
    // }
    return (
        <Container>
            {detail}
            <BtnCon>
                <Btn onClick={onClickAdd}>사진추가</Btn>
                {/* <Btn onClick={onClickDone}>완료</Btn> */}
            </BtnCon>
        </Container>
    );

}

export default AddPhoto;