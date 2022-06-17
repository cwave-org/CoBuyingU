import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService, storageService } from "../fbase";

const BuyingForm = ({ userObj }) => {
  const [name, setName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [count, setCount] = useState("");
  const [size, setSize] = useState("");
  const [address, setAddress] = useState("");
  const [account_name, setAccount_name] = useState("");
  const [account_date, setAccount_date] = useState("");
  const [account_re, setAccount_re] = useState("");

  const location = useLocation();

  const { detailObj } = location.state; // 입력 폼 정보 받아오기

  const onSubmit = async (event) => {
    event.preventDefault();

    const BuyingObj = {
      randomidx: detailObj.randomidx,
      name: name,
      phonenumber: phonenumber,
      count: count,
      size: size,
      address: address,
      createdAt: Date.now(),
      account_date: account_date,
      account_name: account_name,
      account_re: account_re,
      deposit_complete: false,
    };
    await dbService.collection("joinlist").add(BuyingObj);
    setName("");
    setPhonenumber("");
    setCount("");
    setSize("");
    setAddress("");
    setAccount_name("");
    setAccount_date("");
    setAccount_re("");
  };

  const onChange = (event) => {
    const {
        target: { value },
      } = event;
    if (event.target.id == "nameform") {
      setName(value);
    } else if (event.target.id == "phonenumberform") {
      setPhonenumber(value);
    } else if (event.target.id == "countform") {
      setCount(value);
    } else if (event.target.id == "sizeform") {
      setSize(value);
    } else if (event.target.id == "addressform") {
      setAddress(value);
    } else if (event.target.id == "accountnameform") {
      setAccount_name(value);
    } else if (event.target.id == "accountdateform") {
      setAccount_date(value);
    } else if (event.target.id == "accountreform") {
      setAccount_re(value);
    }
  };

  return (
    <div className="container">
      <h1>Buying Form</h1>
      <form onSubmit={onSubmit}>
        <span>이름: </span>
        <input
          id="nameform"
          type="text"
          placeholder="Write name"
          onChange={onChange}
          value={name}
        />
        <br></br>
        <span>전화번호: </span>
        <input
          id="phonenumberform"
          type="tel"
          placeholder="Write phone number"
          onChange={onChange}
          value={phonenumber}
        />
        <br></br>
        <span>수량: </span>
        <input
          id="countform"
          type="number"
          placeholder="수량을 입력하세요"
          onChange={onChange}
          value={count}
        />
        <br></br>
        <span>사이즈: </span>
        <input
          id="sizeform"
          type="text"
          placeholder="사이즈를 입력하세요"
          onChange={onChange}
          value={size}
        />
        <br></br>
        <span>주소:</span>
        <input
          id="addressform"
          type="text"
          placeholder="배송을 원하시면 주소를 입력해주세요"
          onChange={onChange}
          value={address}
        />
        <br></br>
        <span>입금자명: </span>
        <input
          id="accountnameform"
          type="text"
          placeholder="입금자명을 입력해주세요"
          onChange={onChange}
          value={account_name}
        />
        <br></br>
        <span>입금일자: </span>
        <input
          id="accountdateform"
          type="date"
          placeholder="입금일자를 입력해주세요"
          onChange={onChange}
          value={account_date}
        />
        <br></br>
        <span>환불계좌(은행/계좌번호/입금주명): </span>
        <input
          id="accountreform"
          type="text"
          placeholder="환불계좌(은행/계좌번호/입금주명)을 입력해주세요"
          onChange={onChange}
          value={account_re}
        />
        <br></br>
        <input type="submit" />
      </form>
    </div>
  );
};

export default BuyingForm;
