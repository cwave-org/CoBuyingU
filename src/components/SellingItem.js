import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ItemDetails from "./ItemDetalis";

const EachBox = styled.div`
  background-color: #f6f6f6;
  margin: 5px 7px 30px;
  border: 2px solid #f6f6f6;
  border-radius: 10px;
  padding: 5px;
  /* border-bottom: ; */
`;
const EachTitle = styled.div`
  font-weight: 500;
`;
const EachDetail = styled.div`
  margin-bottom: 10px;
`;
const EachInput = styled.input`
  background-color: #f6f6f6;
  width: 100%;
`;
const EachId = styled.div`
  font-weight: 600;
  text-align: center;
`;
const SellingItem = (props) => {
  const [itemname, setItemname] = useState("");
  const [price, setPrice] = useState();
  const [itemDetails, setItemsDetails] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    props.setData([
      {
        id: props.id,
        itemname: itemname,
        price: price,
        itemDetails: itemDetails,
        count: 0,
        itemTotalCount: 0,
      },
      ...props.data,
    ]);
  }, [itemname, price, itemDetails, props]);

  useEffect(() => {
    setItemsDetails(data);
    // setItemsDetails(eachdata,...itemDetails);
  }, [data]);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "itemname") {
      setItemname(value);
    } else if (event.target.id === "price") {
      setPrice(value);
    }
    props.click[props.id]=false;
    // console.log(props.click);
  };

  return (
    <>
      <EachBox>
        <EachId>{props.id+1}번 상품</EachId>
        {/* // <div className="item_container"> */}
        {/* <p className="openjoin_que"> */}
        <EachTitle>✨ 상품 이름</EachTitle>
        <EachDetail>
          <EachInput
            id="itemname"
            value={itemname}
            onChange={onChange}
            type="text"
            placeholder="상품이름 (소이름)"
            maxLength={120}
            required
          />
        </EachDetail>
        <EachTitle>✨ 상품 가격</EachTitle>
        <EachDetail>
          <EachInput
            id="price"
            value={price}
            onChange={onChange}
            type="number"
            placeholder="숫자만 입력해주세요"
            maxLength={120}
            required
          />
        </EachDetail>
        <EachTitle>✨ 상품 상세 설명 (최대 3개)</EachTitle>
        <EachDetail>
          <ItemDetails id={props.id} 
          data={data} setData={setData} 
          />
          {/*<AddPhoto id={props.id} data={data} setData={setData}/>*/}
        </EachDetail>
      </EachBox>
    </>
  );
};

export default SellingItem;
