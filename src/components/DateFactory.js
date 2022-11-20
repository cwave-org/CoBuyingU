import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import SellingItem from "./SellingItem";
import styled from "styled-components";
import DateItem from "./DateItem";

const Box=styled.div`
  /* border: 2px solid #d9d9d9; */
  /* background-color: #F6F6F6; */
  position: relative;
  border-radius: 10px;
`;
const Button=styled.button`
  position: absolute;
  bottom: 20px;
  right: 50px;
  background-color: #d9d9d9;
  color:#5b5b5b;
  /* left:3px; */
`;
const Button1=styled(Button)`
  right: 3px;
`;

const DateFactory = (props) => {
  console.log(props.itemID)
  const [id, setId] = useState(1);
  const [data, setData] = useState([]);
  const [items, setItems] = useState([
    <DateItem
      key={id}
      id={id}
      setData={setData}
      data={data}
      uid={props.userObj.uid}
    />,
  ]);

  const addDate = () => {
    setId(id + 1);
    // console.log(data);
    setItems(
      items.concat(
        <DateItem
          key={id + 1}
          id={id + 1}
          setData={setData}
          data={data}
          uid={props.userObj.uid}
        />
      )
    );
  };

  const onClickDone = async () => {
    await dbService.doc(`datelist/${props.itemID}`).set({data});
    props.setClicked(true);
  };

  return (
    <Box>
      {/* <div className="item_container"> */}
        {/* <p>상품 목록</p> */}
        {items}
        {/* <div> */}
          <Button className="default_Btn_Left" onClick={addDate}>
            날짜 추가
          </Button>
          <Button1 className="default_Btn_Right" onClick={onClickDone}>
            완료
          </Button1>
          <br />
        {/* </div> */}
      {/* </div> */}
    </Box>
  );
};

export default DateFactory;
