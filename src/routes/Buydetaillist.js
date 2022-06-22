import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";

const Buydetaillist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { detailObj } = location.state;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(detailObj.name);
  const [phonenumber, setPhonenumber] = useState(detailObj.phonenumber);
  const [count, setCount] = useState(detailObj.count);
  const [size, setSize] = useState(detailObj.size);
  const [address, setAddress] = useState(detailObj.address);
  const [account_name, setAccount_name] = useState(detailObj.account_name);
  const [account_date, setAccount_date] = useState(detailObj.account_date);
  const [account_re, setAccount_re] = useState(detailObj.account_re);

  const [newDetailObj, setNewDetailObj] = useState(detailObj);

  // 동기화
  useEffect(() => {
    dbService.collection("joinlist").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        if (doc.id == detailObj.id) {
          const item = {
            id: doc.id,
            ...doc.data(),
          };
          setNewDetailObj(item);
        }
      });
    });
  }, []);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하실 건가요?");
    if (ok) {
      await dbService.doc(`joinlist/${detailObj.id}`).delete();
    }
    navigate("/profile", {});
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`joinlist/${detailObj.id}`).update({
      name: newName,
      phonenumber: newPhonenumber,
      count: newCount,
      size: newSize,
      address: newAddress,
      account_date: newAccount_date,
      account_name: newAccount_name,
      account_re: newAccount_re,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "name") {
      setName(value);
    } else if (event.target.id === "phonenumber") {
      setPhonenumber(value);
    } else if (event.target.id === "count") {
      setCount(value);
    } else if (event.target.id === "size") {
      setSize(value);
    } else if (event.target.id === "address") {
      setAddress(value);
    } else if (event.target.id === "accountname") {
      setAccount_name(value);
    } else if (event.target.id === "accountdate") {
      setAccount_date(value);
    } else if (event.target.id === "accountre") {
      setAccount_re(value);
    }
  };

  return (
    <>
      {editing ? (
        <div className="detaillist_content">
          <div className="my_title">💙폼 제출 내용💙</div>
          <hr />
          <>
            <form onSubmit={onSubmit}>
              <p className="openjoin_que">
                <span>이름: </span>
                <input
                  className="openjoin_input"
                  id="name"
                  type="text"
                  placeholder={newName}
                  onChange={onChange}
                  value={newName}
                />
              </p>
              <p className="openjoin_que">
                <span>전화번호: </span>
                <input
                  className="openjoin_input"
                  id="phonenumber"
                  type="tel"
                  placeholder={newPhonenumber}
                  onChange={onChange}
                  value={newPhonenumber}
                />
              </p>
              <p className="openjoin_que">
                <span>수량: </span>
                <input
                  className="openjoin_input"
                  id="count"
                  type="number"
                  placeholder={newCount}
                  onChange={onChange}
                  value={newCount}
                />
              </p>
              <p className="openjoin_que">
                <span>사이즈: </span>
                <input
                  className="openjoin_input"
                  id="size"
                  type="text"
                  placeholder={newSize}
                  onChange={onChange}
                  value={newSize}
                />
              </p>
              <p className="openjoin_que">
                <span>주소:</span>
                <input
                  className="openjoin_input"
                  id="address"
                  type="text"
                  placeholder="배송을 원하시면 주소를 입력해주세요"
                  onChange={onChange}
                  value={newAddress}
                />
              </p>
              <p className="openjoin_que">
                <span>입금자명: </span>
                <input
                  className="openjoin_input"
                  id="accountname"
                  type="text"
                  placeholder="입금자명을 입력해주세요"
                  onChange={onChange}
                  value={newAccount_name}
                />
              </p>
              <p className="openjoin_que">
                <span>입금일자: </span>
                <input
                  className="openjoin_input"
                  id="accountdate"
                  type="date"
                  placeholder="입금일자를 입력해주세요"
                  onChange={onChange}
                  value={newAccount_date}
                />
              </p>
              <p className="openjoin_que">
                <span>환불계좌(은행/계좌번호/입금주명): </span>
                <input
                  className="openjoin_input"
                  id="accountre"
                  type="text"
                  placeholder="환불계좌(은행/계좌번호/입금주명)을 입력해주세요"
                  onChange={onChange}
                  value={newAccount_re}
                />
              </p>
              <div className="buttons">
                <input
                  type="submit"
                  value="Update Contents"
                  className="update_Btn"
                />
                <button onClick={toggleEditing} className="cancel_Btn">
                  Cancel
                </button>
              </div>
            </form>
          </>
        </div>
      ) : (
        <div className="container">
          <div className="mydetail">
            <div className="my_title">💙폼 제출 내용💙</div>
            <hr />
            <div>이름 : {newDetailObj.name}</div>
            <div>전화번호 : {newDetailObj.phonenumber}</div>
            <div>수량 : {newDetailObj.count}</div>
            <div>사이즈 : {newDetailObj.size}</div>
            <div>주소 : {newDetailObj.address}</div>
            <div>입금자명 : {newDetailObj.account_name}</div>
            <div>입금일자 : {newDetailObj.account_date}</div>
            <div>환불계좌 : {newDetailObj.account_re}</div>
          </div>
          <div className="actions">
            <button onClick={onDeleteClick}>TRASH</button>
            <button onClick={toggleEditing}>EDIT</button>
          </div>
        </div>
      )}
    </>
  );
};
export default Buydetaillist;
