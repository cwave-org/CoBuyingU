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
    dbService
      .collection("joinlist")
      .where("randomidx", "==", buyerindex)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const myobj = {
            ...doc.data(),
            id: doc.id,
          };
          const excelobj = {
            size: doc.data().size,
            count: doc.data().count,
          };
          setLists((prev) => [myobj, ...prev]);
          setExcelList((prev) => [excelobj, ...prev]);
          console.log("wowwwwwwwwwwwwwwwwwwwwwwwwwww");
        });
      });
  }, [buyerindex]);
  return (
    <>
      {lists.length > 0 ? (
        <div className="container">
          <div className="joinerlist">
            <div className="my_title">💙참여자 목록💙</div>
            <hr />
            <Excel exceldata={excellist} name={filename} />
            <br />
            <div style={{ marginBottom: "15px" }}>
              <span style={{ width: "15%", float: "right" }}>확인</span>
              <span style={{ width: "20%", float: "right" }}>구매자명</span>
              <span style={{ width: "20%", float: "right" }}>입금자명</span>
              <span style={{ width: "25%", float: "right" }}>입금날짜</span>
              <span style={{ width: "20%", float: "right" }}>구매금액</span>
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
        <div>
          <br /> <br /> <br /> <br />
          <br />
          <img width="100%" src="img/no_participation.png"></img>
        </div>
      )}
    </>
  );
};
export default Itemlist;
