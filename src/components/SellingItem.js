import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";

const SellingItem = (props) => {
  const [itemname, setItemname] = useState("");
  const [price, setPrice] = useState();
  const [itemDetails, setItemsDetails] = useState([]);
  const [id, setId] = useState(1);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    props.setData([
      {
        id: props.id,
        itemname: itemname,
        price: price,
        itemDetails: itemDetails,
      },
      ...props.data,
    ]);
  }, [itemname, price, itemDetails, props]);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "itemname") {
      setItemname(value);
    } else if (event.target.id === "price") {
      setPrice(value);
    }
  };

  const addDetail = () => {
    setId(id + 1);
    setDetails(details.concat());
  };

  const onCLickDone = async () => {
    console.log(props);
    const itemObj = {
      itemIndex: Math.random(),
      creatorId: props.uid,
      itemname: itemname,
      price: price,
      itemDetail: details.length,
    };
    await dbService.collection("itemlist").add(itemObj);
    setItemname("");
  };

  return (
    <div className="item_container">
      <p className="openjoin_que">
        <span>✔️ 가격: </span>
        <input
          id="price"
          className="openjoin_input"
          value={price}
          onChange={onChange}
          type="text"
          placeholder="상품가격"
          maxLength={120}
          required
        />
      </p>

      <p className="openjoin_que">
        <span>✔️ 상품이름 (소이름): </span>
        <input
          id="itemname"
          className="openjoin_input"
          value={itemname}
          onChange={onChange}
          type="text"
          placeholder="상품이름 (소이름)"
          maxLength={120}
          required
        />
      </p>

      <div>
        <button className="default_Btn_Left" onClick={addDetail}>
          상품 설명 추가
        </button>
        <button className="default_Btn_Right" onClick={onCLickDone}>
          완료
        </button>
        <br />
      </div>
    </div>
  );
};

export default SellingItem;
