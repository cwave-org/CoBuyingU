import React, { useState, useEffect } from "react";
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

  useEffect(() => {}, []);

  const addItem = () => {
    setId(id + 1);
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
  const onClickDone = () => {
    props.setEachData(data);
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
