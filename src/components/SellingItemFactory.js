import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import SellingItem from "./SellingItem";

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
    console.log(data);
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
    //각 itemlist 컬렉션에, 공구 폼 열때 만든 randomidx로 doc명 지정해서 생성하는 형식입니당
    for (var i=0;i<data.length;i++){
      let attachmentUrl = "";
      for(var j=0; j<data[i].itemDetails.length;j++){
        if(data[i].itemDetails[j].url!==""){
          const attachmentRef = storageService
            .ref()
            .child(`${props.userObj.uid}/${props.itemID}/${i}/${j}`);
            //스토리지에는 공대표의 uid 폴더 안의 공구항목randomidx 폴더명으로 들어가용
          const response = await attachmentRef.putString(data[i].itemDetails[j].url, "data_url");
          attachmentUrl = await response.ref.getDownloadURL();
          data[i].itemDetails[j].url=attachmentUrl;
        }
      }
    }
    await dbService.doc(`itemlist/${props.itemID}`).set({data});

    
  };

  return (
    <>
      <div className="item_container">
        <p>상품 목록</p>
        {items}
        <div>
          <button className="default_Btn_Left" onClick={addItem}>
            상품 추가
          </button>
          <button className="default_Btn_Right" onClick={onClickDone}>
            완료
          </button>
          <br />
        </div>
      </div>
    </>
  );
};

export default SellingItemFactory;
