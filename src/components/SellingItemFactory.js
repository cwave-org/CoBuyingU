import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import SellingItem from "./SellingItem";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";


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

const SellingItemFactory = (props) => {
  const [id, setId] = useState(1);
  const [data, setData] = useState([]);
  const [items, setItems] = useState([
    <SellingItem
      key={id}
      id={id}
      setData={setData}
      data={data}
      uid={props.userObj.uid}
    />,
  ]);

  const addItem = () => {
    setId(id + 1);
    // console.log(data);
    setItems(
      items.concat(
        <SellingItem
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
    for (var i=0;i<data.length;i++){
      let attachmentUrl = "";
      for(var j=0; j<data[i].itemDetails.length;j++){
        for(var k=0; k<data[i].itemDetails[j].url.length; k++){ //사진 url변경
          if(data[i].itemDetails[j].url[k] !==""){
            const attachmentRef = storageService
              .ref()
              .child(`${props.userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(data[i].itemDetails[j].url[k], "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
            data[i].itemDetails[j].url[k]=attachmentUrl;
            console.log(attachmentUrl);
          }
        }
      }
    }
    await dbService.doc(`itemlist/${props.itemID}`).set({data});
    props.setClicked(true);
    
  };

  return (
    <Box>
        {items}
          <Button className="default_Btn_Left" onClick={addItem}>
            상품 추가
          </Button>
          <Button1 className="default_Btn_Right" onClick={onClickDone}>
            완료
          </Button1>
          <br />
    </Box>
  );
};

export default SellingItemFactory;
