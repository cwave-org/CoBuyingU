import styled from "styled-components";

const Container = styled.div``;
const EachTitle = styled.div`
  font-weight: 600;
  margin: 4px 0;
`;
const EachContent = styled.div``;
const EachDetailContent = styled(EachContent)`
  margin: 5px 5px 5px;
  width: 50%;
`;
const EachSet = styled.div`
  background-color: #f6f6f6;
  margin: 2px 4px 15px;
  padding: 3px 5px;
  border-radius: 7px;
`;
const EachImg = styled.img`
  width: 100%;
  height: auto;
  max-height: 200px;
  min-height: 100px;
  display: "flex",
  flexDirection: "column",
  justify: "center",
`;
const Half = styled.div`
  display: flex;
  margin: 3px 5px 10px;
  background-color: white;
  padding: 5px;
  border-radius: 7px;
  justify-content: space-around;
`;
const PostListWrapper = styled.div`
  display: grid;
  place-items: center;
  justify-content: space-evenly;
  font-size: small;
  row-gap: 5x;
  grid-template-columns: repeat(2, auto);
`;
const EachDetail = ({ eachObj }) => {
  console.log(JSON.stringify(eachObj));
  return (
    <Container>
      {eachObj ? (
        <>
          {eachObj.map((each) => (
            <EachSet key={each.id}>
              <EachTitle>
                ✨ 상품 {each.id + 1}. {each.itemname}
              </EachTitle>
              <EachTitle>✨ 가격: {each.price}원</EachTitle>
              {/*((each.maxNum === 0 || each.maxNum==="") ? (<></>) : (<>
                    {(each.maxNum > (each.itemTotalCount + each.maxNum * 0.03)) 
                        ? (
                            <EachTitle>✨ 재고: {(each.maxNum - each.itemTotalCount - each.maxNum * 0.03).toFixed()}개</EachTitle>
                        ) : (
                            <EachTitle>✨ 재고: 해당 상품은 매진되었습니다.</EachTitle>
                        )
                    }</>))*/}
              <EachTitle>✨ 상세 설명</EachTitle>
              {each.itemDetails.map((option) => (
                <div>
                  <PostListWrapper>
                    {option.url.map((imgurl) => (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "5px",
                          marginBottom: "10px",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "20px",
                          position: "relative",
                          zIndex: 0,
                        }}
                      >
                        <EachImg src={imgurl} alt="옵션이미지" />
                      </div>
                    ))}{" "}
                  </PostListWrapper>
                  <EachDetailContent>{option.content}</EachDetailContent>
                </div>
              ))}
            </EachSet>
          ))}
        </>
      ) : (
        <div>로딩중입니다.</div>
      )}
    </Container>
  );
};

export default EachDetail;
