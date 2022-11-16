import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container=styled.div`

`;
const EachTitle=styled.div`
    font-weight: 600;
    margin:4px 0;
`;
const EachContent=styled.div`

`;
const EachDetailContent=styled(EachContent)`
    margin: 1px 4px 3px;

`;
const EachSet=styled.div`
    background-color: #f6f6f6;
    margin: 2px 4px 15px;
    padding: 3px 5px;
    border-radius: 7px;
`;
const EachImg=styled.img`
    width: 50%;
    height: auto;
    max-height: 200px;
    min-height: 100px;
`;
const Half=styled.div`
    display: flex;
    margin:3px 5px 10px;
    background-color: white;
    padding: 5px;
    border-radius: 7px;
    justify-content: space-around;
`;
const EachDetail=({eachObj})=>{
    const [item,setItem]=useState([]);

    // useEffect(()=>{
    //     console.log(item);
    // },[item]);

    return(
        <Container>
            {eachObj?(
                <>
                {eachObj.map((each)=>(
                    <EachSet key={each.id}>
                        <EachTitle>✨ 옵션 {each.id}. {each.itemname}</EachTitle>
                        <EachTitle>✨ 가격: {each.price}원</EachTitle>
                        <EachTitle>✨ 상세 설명</EachTitle>
                        {each.itemDetails.map((option)=>(
                            <Half>
                                <EachDetailContent>{option.content}</EachDetailContent>
                                <EachImg src={option.url} alt="옵션이미지" />                                
                            </Half>
                            
                        ))}
                        
                    </EachSet>
                ))}
                </>
            ):(
                <div>로딩중</div>
            )}
            {/* {eachObj.map((each)=>{
                <div key={each.id}>
                    <EachTitle>상품명</EachTitle>
                    <EachContent>{each.content}</EachContent>
                </div>
            })}
             */}
        </Container>
    );
}

export default EachDetail;