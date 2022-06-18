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
            <span style={{width: '20%'}}>{`${listObj.count}`}</span>
            <span style={{width: '25%'}}>{`${listObj.account_date}`}</span>
            <span style={{width: '20%'}}>{`${listObj.name}`}</span>
            <span style={{width: '20%'}}>{`${listObj.account_name}`}</span>

              {!checked ? (
                <input style={{width: '15%'}} type="checkbox" onChange={check} checked></input>
              ) : (
                <input style={{width: '15%'}} type="checkbox" onChange={check}></input>
              )}
            </div>
            
            <br></br>
  
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Item;
