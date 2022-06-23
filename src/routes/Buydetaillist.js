import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    setEditing(false);
    await dbService.doc(`joinlist/${detailObj.id}`).update({
      name: name,
      phonenumber: phonenumber,
      count: count,
      size: size,
      address: address,
      account_date: account_name,
      account_name: account_date,
      account_re: account_re,
    });
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
        <div className="openjoin_container">
          <p className="my_title">💙폼 제출 내용💙</p>
          <hr />
          <>
            <form onSubmit={onSubmit}>
              <p className="openjoin_que">
                <span>✔️ 이름: </span>
                <input
                  className="openjoin_input"
                  id="name"
                  type="text"
                  placeholder={name}
                  onChange={onChange}
                  value={name}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span>✔️ 전화번호: </span>
                <input
                  className="openjoin_input"
                  id="phonenumber"
                  type="tel"
                  placeholder={phonenumber}
                  onChange={onChange}
                  value={phonenumber}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span>✔️ 수량: </span>
                <input
                  className="openjoin_input"
                  id="count"
                  type="number"
                  placeholder={count}
                  onChange={onChange}
                  value={count}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span>✔️ 사이즈: </span>
                <input
                  className="openjoin_input"
                  id="size"
                  type="text"
                  placeholder={size}
                  onChange={onChange}
                  value={size}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span>✔️ 주소:</span>
                <input
                  className="openjoin_input"
                  id="address"
                  type="text"
                  placeholder={address}
                  onChange={onChange}
                  value={address}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span>✔️ 입금자명: </span>
                <input
                  className="openjoin_input"
                  id="accountname"
                  type="text"
                  placeholder={account_name}
                  onChange={onChange}
                  value={account_name}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span>✔️ 입금일자: </span>
                <input
                  className="openjoin_input"
                  id="accountdate"
                  type="date"
                  placeholder={account_date}
                  onChange={onChange}
                  value={account_date}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span className="openjoin_long">
                  ✔️ 환불계좌(은행/계좌번호/입금주명):{" "}
                </span>
                <input
                  className="openjoin_input"
                  id="accountre"
                  type="text"
                  placeholder={account_re}
                  onChange={onChange}
                  value={account_re}
                  required
                />
              </p>
              <div>
                <button className="default_Btn_Right" onClick={toggleEditing}>
                  취소
                </button>
                <button type="submit" className="default_Btn_Right">
                  제출
                </button>
              </div>
            </form>
          </>
        </div>
      ) : (
        <div className="openjoin_container">
          <p className="my_title">💙폼 제출 내용💙</p>
          <hr />
          <p className="openjoin_que">
            <span className="openjoin_long">✔️ 이름: {newDetailObj.name} </span>
          </p>
          <p className="openjoin_que">
            <span className="openjoin_long">
              ✔️ 전화번호: {newDetailObj.phonenumber}{" "}
            </span>
          </p>
          <p className="openjoin_que">
            <span className="openjoin_long">
              ✔️ 수량: {newDetailObj.count}{" "}
            </span>
          </p>
          <p className="openjoin_que">
            <span className="openjoin_long">
              ✔️ 사이즈: {newDetailObj.size}{" "}
            </span>
          </p>
          <p className="openjoin_que">
            <span className="openjoin_long">
              ✔️ 주소: {newDetailObj.address}{" "}
            </span>
          </p>
          <p className="openjoin_que">
            <span className="openjoin_long">
              ✔️ 입금자명: {newDetailObj.account_name}{" "}
            </span>
          </p>
          <p className="openjoin_que">
            <span className="openjoin_long">
              ✔️ 입금일자: {newDetailObj.account_date}{" "}
            </span>
          </p>
          <p className="openjoin_que">
            <span className="openjoin_long">
              ✔️ 환불계좌: {newDetailObj.account_re}{" "}
            </span>
          </p>
          <div style={{ float: "right" }}>
            <FontAwesomeIcon
              icon={faPencilAlt}
              size="1x"
              color={"#C7D3F7"}
              title="수정"
              onClick={toggleEditing}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default Buydetaillist;
