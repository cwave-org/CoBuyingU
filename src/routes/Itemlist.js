import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import Item from "../components/Item";
import Excel from "../components/Excel";

const Itemlist = () => {
  const location = useLocation();
  const { buyerindex, filename } = location.state;
  const [lists, setLists] = useState([]);
  const [excellist, setExcelList] = useState([]);
  useEffect(() => {
    dbService.collection("joinlist").onSnapshot((snapshot) => {
      setLists([]);
      setExcelList([]);
      snapshot.docs.map((doc) => {
        if (doc.data().randomidx == buyerindex) {
          const myobj = {
            ...doc.data(),
            id: doc.id,
          };
          var excelobj = {
            입금자명: doc.data().account_name,
            입금날짜시간: doc.data().account_date,
            구매갯수:doc.data().account_re,
            구매총액: doc.data().totalprice,
            환불계좌:doc.data().account_re,
            전화번호:doc.data().phonenumber,
            수령날짜:doc.data().receivedate,
          };
          for (var i=0;i<doc.data().option.length;i++){
            var name = doc.data().optionname[i];
            excelobj[name] = doc.data().option[i];
          }
          setLists((prev) => [myobj, ...prev]);
          setExcelList((prev) => [excelobj, ...prev]);
        }
      });
    });
  }, []);

  return (
    <>
      {lists.length > 0 ? (
        <div className="container">
          <div className="joinerlist">
            <div className="my_title">💙참여자 목록💙</div>
            <hr />
            <Excel exceldata={excellist} name={filename} />
            <br />
            <div style={{ marginBottom: "15px", fontSize: 12 }}>
              <span style={{ width: "10%", float: "right", textAlign: "center" }}>삭제</span>
              <span style={{ width: "10%", float: "right", textAlign: "center" }}>확인</span>
              <span style={{ width: "20%", float: "right" }}>환불계좌</span>
              <span style={{ width: "20%", float: "right" }}>구매자명</span>
              <span style={{ width: "24%", float: "right" }}>입금날짜</span>
              <span style={{ width: "16%", float: "right" }}>총 입금금액</span>{" "}
            </div>
            <br />
            <div className="joiner_context">
              {lists.map((list) => (
                <Item
                  key={list.id}
                  listObj={list}
                  isBuyer={list.randomidx === buyerindex}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "90%",
            height: "fit-content",
            padding: "10px",
            backgroundColor: " rgb(255, 255, 255)",
            borderRadius: "10px",
            marginTop: "120px",
          }}
        >
          <img width="100%" src="img/no_participation.png" alt="로딩"></img>
        </div>
      )}
    </>
  );
};
export default Itemlist;
