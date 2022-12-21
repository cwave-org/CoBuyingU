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
  const [receive_date, setReceive_date] = useState(detailObj.date);
  const [newDetailObj, setNewDetailObj] = useState(detailObj);
  const [today, setToday] = useState(new Date());
  const [randomidx, setRandomidx] = useState(detailObj.randomidx);
  const [itemdeadline, setItemdeadline] = useState(new Date());
  const [isDateLodded, setIsDateLodded] = useState(0);
  const [dates, setDates] = useState([]);
  const [dateoption, setDateOption] = useState([]);
  const handout = (event, date, i) => {
    setDateOption(date);
  };

  const onReload = () => {
    window.location.reload();
  };
  // 동기화
  useEffect(() => {
    dbService.doc(`datelist/${detailObj.randomidx}`).onSnapshot((snapshot) => {
      setDates(snapshot.data().data.reverse());
      setIsDateLodded(1);
      for (var i = 0; i < snapshot.data().data.length; i++) {
        setDateOption((current) => [0, ...current]);
      }
    });
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

    //random값을 통해서 일치하는 doc에 접근
    dbService
      .collection("startlist")
      .get()
      .then((docs) => {
        // 반복문으로 docuemnt 하나씩 확인
        docs.forEach((doc) => {
          if (doc.exists) {
            // document의 데이터
            if (doc.data().randomidx == detailObj.randomidx) {
              const dead = {
                id: doc.id,
                ...doc.data(),
              };
              setRandomidx(dead);
              setItemdeadline(dead.deadline);
            }
          }
        });
      });
    /*dbService.collection("startlist").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        if (doc[randomidx].randomidx == detailObj.randomidx) {
          const dead = {
            id: doc.id,
            ...doc.data(),
          };
          setRandomidx(dead);
        }
      });
    });*/

    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1 < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1) +
      "-" +
      (today.getDate() < 9 ? "0" + today.getDate() : today.getDate());
    setToday(date);
  }, []);
  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    var answer = window.confirm("정말로 수정하시겠습니까?");
    if (answer) {
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
        date: dateoption,
      });
      // window.location.reload();
    } else {
      event.preventDefault();
    }
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
    } else if (event.target.id === "hadnout_date") {
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
                <EachTitle>✔️ 입금자 명</EachTitle>
                <EachDetail>{newDetailObj.account_name}</EachDetail>
              </EachContainer>

              <EachContainer>
                <EachTitle>✔️ 전화번호</EachTitle>
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
                <EachTitle>✔️ 현장배부 날짜</EachTitle>
                <EachDetail>
                  {isDateLodded &&
                    dates.map((date, i) => (
                      <SelectNum key={i}>
                        {i + 1}. {date.handout_date}
                        <NumBox>
                          <Btn
                            onClick={(event) =>
                              handout(event, date.handout_date, i)
                            }
                          >
                            <input
                              type="radio"
                              value={date.handout_date}
                              name="hadnout_date"
                              onChange={onChange}
                            />
                          </Btn>
                        </NumBox>
                      </SelectNum>
                    ))}
                  {/* <input
              className="openjoin_input"
              id="receivedate"
              type="date"
              placeholder={receive_date}
              onChange={onChange}
              value={receive_date}
              // min="2022-11-30"
              // max="2022-12-02"
              required
              /> */}
                </EachDetail>
              </EachContainer>

              <EachContainer>
                <EachTitle>✔️ 입금 날짜 및 시간</EachTitle>
                <EachDetail>{newDetailObj.account_date}</EachDetail>
              </EachContainer>

              <EachContainer>
                <EachTitle>✔️ 환불계좌</EachTitle>
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
                <EachTitle>✔️ 구매 수량</EachTitle>
                <EachDetail>
                  {newDetailObj.optionname.map((opt) => (
                    <div key={newDetailObj.optionname.indexOf(opt)}>
                      {newDetailObj.optionname.indexOf(opt) + 1}. {opt} :{" "}
                      {
                        newDetailObj.option[
                          newDetailObj.optionname.indexOf(opt)
                        ]
                      }
                      개
                    </div>
                  ))}
                </EachDetail>
              </EachContainer>

              <EachContainer>
                <EachTitle>✔️ 구매 금액</EachTitle>
                <EachDetail>{newDetailObj.totalprice} 원</EachDetail>
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
            <EachTitle>✔️ 입금자 명</EachTitle>
            <EachDetail>{newDetailObj.account_name}</EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>✔️ 전화번호</EachTitle>
            <EachDetail>{newDetailObj.phonenumber}</EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>✔️ 현장배부 날짜</EachTitle>
            <EachDetail>{newDetailObj.date}</EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>✔️ 입금 날짜 및 시간</EachTitle>
            <EachDetail>{newDetailObj.account_date}</EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>✔️ 환불계좌</EachTitle>
            <EachDetail>{newDetailObj.account_re}</EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>✔️ 구매 수량</EachTitle>
            <EachDetail>
              {newDetailObj.optionname.map((opt) => (
                <div key={newDetailObj.optionname.indexOf(opt)}>
                  {newDetailObj.optionname.indexOf(opt) + 1}. {opt} :{" "}
                  {newDetailObj.option[newDetailObj.optionname.indexOf(opt)]}개
                </div>
              ))}
            </EachDetail>
          </EachContainer>

          <EachContainer>
            <EachTitle>✔️ 구매 금액</EachTitle>
            <EachDetail>{newDetailObj.totalprice} 원</EachDetail>
          </EachContainer>
          <div style={{ float: "right" }}>
            {itemdeadline >= today ? (
              <FontAwesomeIcon
                icon={faPencilAlt}
                size="1x"
                color={"#C7D3F7"}
                title="수정"
                onClick={toggleEditing}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Buydetaillist;

const EachContainer = styled.div`
  width: 100%;
  margin: 3px 3px 15px;
`;
const EachContainer1 = styled(EachContainer)`
  margin: 3px 3px 65px;
  position: relative;
`;
const EachTitle = styled.div`
  font-weight: 600;
  position: relative;
`;
const EachDetail = styled.div`
  margin-top: 1px;
`;
const SelectNum = styled.div`
  border-radius: 5px;
  background-color: #f6f6f6;
  margin: 5px 10px 10px;
  padding: 3px 10px 35px;
  position: relative;
`;
const Sum = styled(SelectNum)`
  position: absolute;
  bottom: -55px;
  right: 0;
  font-weight: 600;
  font-size: 19px;
  padding: 3px 10px;
  color: black;
  text-align: center;
`;
const Btn = styled.button`
  background-color: #b6b6b6;
  border-radius: 5px;
  color: #5b5b5b;
  width: 27px;
  height: 30px;
  font-size: 15px;
`;
const NumBox = styled.div`
  background-color: #b6b6b6;
  position: absolute;
  border-radius: 5px;
  display: flex;
  right: 10px;
`;
const Count = styled.div`
  background-color: #f6f6f6;
  width: 30px;
  text-align: center;
`;
