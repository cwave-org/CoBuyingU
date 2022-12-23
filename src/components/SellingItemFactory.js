import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import SellingItem from "./SellingItem";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";


const Load = styled.div`
  width: 100%;
  position: fixed;
  top:0%;
  left: 0vw;
  height: 100vh;
  z-index: 1;
  background-color:rgba(0, 0, 0, 0.8);
`;
const LoadImg=styled.div`
  position: fixed;
  top: 30vh;
  left: 23%;
  /* width:30%; */
`;

const Box = styled.div`
  /* border: 2px solid #d9d9d9; */
  /* background-color: #F6F6F6; */
  position: relative;
  border-radius: 10px;
`;
const Button = styled.button`
  position: absolute;
  bottom: 20px;
  right: 50px;
  background-color: #d9d9d9;
  color: #5b5b5b;
  /* left:3px; */
`;
const Button1 = styled(Button)`
  right: 3px;
`;

const SellingItemFactory = (props) => {
  // const [id,setId]=useState(1);
  const [loading,isLoading]=useState(false);
  const [data, setData] = useState([]);
  const [items, setItems] = useState([
    <SellingItem
      key={props.id}
      id={props.id}
      setData={setData}
      data={data}
      uid={props.userObj.uid}
      click={props.click}
    />,
  ]);
  useEffect(()=>{
    setData(data);
  },[data])

  const addItem = () => {
    props.setId(props.clickid+1);
    props.setClick(props.click.concat(false));

    // setId(id + 1);
    setItems(
      items.concat(
        <SellingItem
          key={props.id+1}
          id={props.id+1}
          setData={setData}
          data={data}
          uid={props.userObj.uid}
          click={props.click}
        />
      )
    );
  };

  const onClickDone = async () => {
    onDataSet();
    isLoading(true);
    for (var i=0;i<data.length;i++){

      let attachmentUrl = "";
      for(var j=0; j<data[i].itemDetails.length;j++){
        for(var k=0; k<data[i].itemDetails[j].beforeurl.length; k++){ //사진 url변경
          if(data[i].itemDetails[j].beforeurl[k] !==""){
            // console.log(data[i].itemDetails[j].url[k]);
            const attachmentRef = storageService
              .ref()
              .child(`${props.userObj.uid}/${uuidv4()}`);
            // console.log(attachmentRef);
            window.alert(data[i].itemDetails[j].beforeurl[k]);
            const response = await attachmentRef.putString(data[i].itemDetails[j].beforeurl[k], "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
            data[i].itemDetails[j].url[k] = attachmentUrl;
          }
        }
      }
    }

    await dbService.doc(`itemlist/${props.itemID}`).set({data});
    isLoading(false);
    // props.setClicked(true);
    

  };
  const onDataSet=()=>{
    props.click[props.id]=true;
    // console.log(props.click);
  }

  return (
    <Box>

        {items}
          {loading&&
            <Load>
              <LoadImg>
                <img src="img/loading.gif" alt="로딩" />
              </LoadImg>
            </Load>
          }
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
