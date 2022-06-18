import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../fbase";

const Item = ({ listObj, isBuyer }) => {
  const [newList, setNewList] = useState(listObj.text);
  const [checked, setChecked] = useState(!listObj.deposit_complete);
  let navigate = useNavigate();

  const check = async (event) => {
    setChecked((current) => !current);
    await dbService.doc(`joinlist/${listObj.id}`).update({
      deposit_complete: checked,
    });
  };

  return (
    <div className="Itemclass">
      {isBuyer ? (
        <>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h4>송금 완료: </h4>
              {!checked ? (
                <input type="checkbox" onChange={check} checked></input>
              ) : (
                <input type="checkbox" onChange={check}></input>
              )}
            </div>
            <h4>구매자 이름: {`${listObj.name}`}</h4>
            <br></br>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Item;
