import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
let key=0;//새로고침될 때마다 재호출됨.

const SellingForm = ({ userObj }) => {
  const [name, setName] = useState("");
  const [itemname, setItemname] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [etc, setEtc] = useState("");
  const [account, setAccount] = useState("");
  const [attachment, setAttachment] = useState("");
  
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const listObj = {
      name: name,
      itemname: itemname,
      item : item,
      price: price,
      deadline: deadline,
      key:key,
      datetime: Date.now(),
      creatorId: userObj.uid,
      account : account,
      etc : etc,
      attachmentUrl,
    };
    await dbService.collection("startlist").add(listObj);
    setName("");
    setItemname("");
    setItem("");
    setPrice("");
    setDeadline("");
    setAttachment("");
    setEtc("");
    setAccount("");
    key=key+1;
  };
  const onChange_name = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };
  const onChange_itemname = (event) => {
    const {
      target: { value },
    } = event;
    setItemname(value);
  };
  const onChange_item = (event) => {
    const {
      target: { value },
    } = event;
    setItem(value);
  };
  const onChange_price = (event) => {
    const {
      target: { value },
    } = event;
    setPrice(value);
  };
  const onChange_deadline = (event) => {
    const {
      target: { value },
    } = event;
    setDeadline(value);
  };
  const onChange_etc = (event) => {
    const {
      target: { value },
    } = event;
    setEtc(value);
  };
  const onChange_account = (event) => {
    const {
      target: { value },
    } = event;
    setAccount(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);

  return (
    <form onSubmit={onSubmit}>
      <p>이름 : 
      <input
        value={name}
        onChange={onChange_name}
        type="text"
        placeholder="이름"
        maxLength={120}
      />
      </p>

      <p>상품이름 : 
      <input
        value={itemname}
        onChange={onChange_itemname}
        type="text"
        placeholder="상품이름"
        maxLength={120}
      />
      </p>

      <p>품목: 
      <input
        value={item}
        onChange={onChange_item}
        type="text"
        placeholder="품목"
        maxLength={120}
      />
      </p>

      <p>가격(원) : 
      <input
        value={price}
        onChange={onChange_price}
        type="number"
        placeholder="가격(원)"
        maxLength={120}
      />
      </p>

      <p>마감기한 : 
      <input
        value={deadline}
        onChange={onChange_deadline}
        type="date"
        placeholder="마감기한"
        maxLength={120}
      />
      </p>

      <p>기타사항 :
      <input
        value={etc}
        onChange={onChange_etc}
        type="text"
        placeholder="기타사항"
        maxLength={120}
      />
      </p>

      <p>계좌(은행/ 계좌번호/입금주명) : 
      <input
        value={account}
        onChange={onChange_account}
        type="text"
        placeholder="계좌(은행/ 계좌번호/입금주명)"
        maxLength={120}
      />
      </p>

      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="제출하기" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
      
    </form>
  );
};
export default SellingForm;