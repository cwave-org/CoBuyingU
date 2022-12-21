import React, { useState } from "react";
import { dbService } from "../fbase";
import styled from "styled-components";
import DateItem from "./DateItem";

const Box=styled.div`
  position: relative;
  border-radius: 10px;
`;
const Button=styled.button`
  position: absolute;
  bottom: 0px;
  right: 50px;
  background-color: #d9d9d9;
  color:#5b5b5b;
`;
const Button1=styled(Button)`
  right: 3px;
`;

const DateFactory = (props) => {
  //console.log(props.itemID)
  const [id, setId] = useState(1);
  const [data1, setData1] = useState([]);
  const [items, setItems] = useState([
    <DateItem
      key={id}
      id={id}
      setData1={setData1}
      data1={data1}
      uid={props.userObj.uid}
    />,
  ]);

  const addDate = () => {
    setId(id + 1);
    // console.log(data1);
    setItems(
      items.concat(
        <DateItem
          key={id + 1}
          id={id + 1}
          setData1={setData1}
          data1={data1}
          uid={props.userObj.uid}
        />
      )
    );
  };

  const onClickDone = async (event) => {
    event.preventDefault();
    await dbService.doc(`datelist/${props.itemID}`).set({data1});
    props.setClicked(true);
  };

  return (
    <Box>
        {items}
        {/* <div> */}
          <Button className="default_Btn_Left" onClick={addDate}>
            날짜 추가
          </Button>
          <Button1 className="default_Btn_Right" onClick={onClickDone}>
            완료
          </Button1>
          <br />
    </Box>
  );
};

export default DateFactory;