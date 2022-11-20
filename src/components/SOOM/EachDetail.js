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
    width: 50%;
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
    return(
        <Container>
            {eachObj ? (
                <>
                {eachObj.map((each)=>( 
                <EachSet key={each.id}>
                    <EachTitle>✨ 옵션 {each.id}. {each.itemname}</EachTitle>
                    <EachTitle>✨ 가격: {each.price}원</EachTitle>
                    {(each.maxNum == 0 ? (<></>) : (<>
                    {(each.maxNum > (each.itemTotalCount + each.maxNum * 0.03)) 
                        ? (
                            <EachTitle>✨ 재고: {(each.maxNum - each.itemTotalCount - each.maxNum * 0.03).toFixed()}개</EachTitle>
                        ) : (
                            <EachTitle>✨ 재고: 해당 상품은 매진되었습니다.</EachTitle>
                        )
                    }</>))}
                    <EachTitle>✨ 상세 설명</EachTitle>
                    {each.itemDetails.reverse().map((option)=>(
                        <Half key={option.id}>
                            <EachImg src={option.url} alt="옵션이미지" />                                
                            <EachDetailContent>{option.content}</EachDetailContent>
                        </Half>
                        
                    ))}        
                </EachSet>
                ))}
                </>
            ):(
                <div>로딩중입니다.</div>
            )}
        </Container>
    );
}

export default EachDetail;