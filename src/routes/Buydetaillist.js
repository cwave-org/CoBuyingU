import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";

const Buydetaillist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { detailObj } = location.state;

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(detailObj.name);
  const [newPhonenumber, setNewPhonenumber] = useState(detailObj.phonenumber);
  const [newCount, setNewCount] = useState(detailObj.count);
  const [newSize, setNewSize] = useState(detailObj.size);
  const [newAddress, setNewAddress] = useState(detailObj.address);
  const [newAccount_name, setNewAccount_name] = useState(
    detailObj.account_name
  );
  const [newAccount_date, setNewAccount_date] = useState(
    detailObj.account_date
  );
  const [newAccount_re, setNewAccount_re] = useState(detailObj.account_re);

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
    if (event.target.id === "nameform") {
      const {
        target: { value },
      } = event;
      setNewName(value);
    } else if (event.target.id === "phonenumberform") {
      const {
        target: { value },
      } = event;
      setNewPhonenumber(value);
    } else if (event.target.id === "countform") {
      const {
        target: { value },
      } = event;
      setNewCount(value);
    } else if (event.target.id === "sizeform") {
      const {
        target: { value },
      } = event;
      setNewSize(value);
    } else if (event.target.id === "addressform") {
      const {
        target: { value },
      } = event;
      setNewAddress(value);
    } else if (event.target.id === "accountnameform") {
      const {
        target: { value },
      } = event;
      setNewAccount_name(value);
    } else if (event.target.id === "accountdateform") {
      const {
        target: { value },
      } = event;
      setNewAccount_date(value);
    } else if (event.target.id === "accountreform") {
      const {
        target: { value },
      } = event;
      setNewAccount_re(value);
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
                  id="nameform"
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
                  id="phonenumberform"
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
                  id="countform"
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
                  id="sizeform"
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
                  id="addressform"
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
                  id="accountnameform"
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
                  id="accountdateform"
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
                  id="accountreform"
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
