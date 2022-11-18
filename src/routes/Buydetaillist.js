import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

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
  const [receive_date, setReceive_date] = useState(detailObj.receive_date);
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
     /* name: name,
      count: count,
      size: size,
      address: address,
      account_date: account_name,
      account_name: account_date,*/
      phonenumber: phonenumber,
      account_re: account_re,
      receivedate:receive_date,
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
    else if (event.target.id === "receivedate") {
      setReceive_date(value);
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
          <EachContainer>
            <EachTitle>
              ✔️ 입금자 명
            </EachTitle>
            <EachDetail>
              {newDetailObj.account_name}
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 전화번호
            </EachTitle>
            <EachDetail>
            <input
              className="openjoin_input"
              id="phonenumber"
              type="tel"
              placeholder={phonenumber}
              onChange={onChange}
              value={phonenumber}
              required
              />
            </EachDetail>
          </EachContainer>
          
          <EachContainer>
            <EachTitle>
              ✔️ 현장배부 날짜
            </EachTitle>
            <EachDetail>
            <input
              className="openjoin_input"
              id="receivedate"
              type="date"
              placeholder={receive_date}
              onChange={onChange}
              value={receive_date}
              min="2022-11-30"
              max="2022-12-02"
              required
              />
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 입금 날짜 및 시간
            </EachTitle>
            <EachDetail>
              {newDetailObj.account_date}
            </EachDetail>
          </EachContainer>
          
          <EachContainer>
            <EachTitle>
              ✔️ 환불계좌
            </EachTitle>
            <EachDetail>
            <input
              className="openjoin_input"
              id="accountre"
              type="text"
              placeholder={account_re}
              onChange={onChange}
              value={account_re}
              required
              />

            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 구매 수량 
            </EachTitle>
            <EachDetail>
              1번 상품 : {newDetailObj.option[0]} 개 <br></br>
              2번 상품 : {newDetailObj.option[1]} 개
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 구매 금액
            </EachTitle>
            <EachDetail>
              {newDetailObj.totalprice} 원
            </EachDetail>
          </EachContainer>
            
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
          <EachContainer>
            <EachTitle>
              ✔️ 입금자 명
            </EachTitle>
            <EachDetail>
              {newDetailObj.account_name}
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 전화번호
            </EachTitle>
            <EachDetail>
              {newDetailObj.phonenumber}
            </EachDetail>
          </EachContainer>
          
          <EachContainer>
            <EachTitle>
              ✔️ 현장배부 날짜
            </EachTitle>
            <EachDetail>
              {newDetailObj.receivedate}
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 입금 날짜 및 시간
            </EachTitle>
            <EachDetail>
              {newDetailObj.account_date}
            </EachDetail>
          </EachContainer>
          
          <EachContainer>
            <EachTitle>
              ✔️ 환불계좌
            </EachTitle>
            <EachDetail>
              {newDetailObj.account_re}
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 구매 수량 
            </EachTitle>
            <EachDetail>
              1번 상품 : {newDetailObj.option[0]} 개 <br></br>
              2번 상품 : {newDetailObj.option[1]} 개
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>
              ✔️ 구매 금액
            </EachTitle>
            <EachDetail>
              {newDetailObj.totalprice} 원
            </EachDetail>
          </EachContainer>
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

const EachContainer=styled.div`
  width: 100%;
  margin: 3px 3px 15px;
`;
const EachContainer1=styled(EachContainer)`
  margin: 3px 3px 65px;
  position: relative;
`;
const EachTitle=styled.div`
  font-weight: 600;
  position: relative;
`
const EachDetail=styled.div`
  margin-top: 1px;
`;
const SelectNum=styled.div`
  border-radius: 5px;
  background-color: #F6F6F6;
  margin:5px 10px 10px;
  padding:3px 10px 35px;
  position:relative;
`;
const Sum=styled(SelectNum)`
  position: absolute;
  bottom: -55px;
  right: 0;
  font-weight: 600;
  font-size: 19px;
  padding:3px 10px;
  color: black;
  text-align: center;
`;
const Btn=styled.button`
  background-color: #b6b6b6;
  border-radius: 5px;
  color: #5b5b5b;
  width: 27px;
  font-size: 15px;
`;
const NumBox=styled.div`
  background-color: #b6b6b6;
  position:absolute;
  border-radius: 5px;
  display: flex;
  right: 10px;
`;
const Count=styled.div`
  background-color: #f6f6f6;
  width: 30px;
  text-align: center;
`;