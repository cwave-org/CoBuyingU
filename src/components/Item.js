import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Item = ({ listObj, isBuyer }) => {
  const [checked, setChecked] = useState(!listObj.deposit_complete);
  let navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    dbService
      .collection("startlist")
      .where("randomidx", "==", listObj.randomidx)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setPrice(Number(listObj.count) * Number(doc.data().price));
        });
      });
  }, []);

  const check = async (event) => {
    setChecked((current) => !current);
    await dbService.doc(`joinlist/${listObj.id}`).update({
      deposit_complete: checked,
    });
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하실 건가요?");
    /* firebase에서 삭제하는 코드
    if (ok) {
      await dbService.doc(`joinlist/${listObj.id}`).delete();
    }
    */

    if(ok){
      setDeleted((current) => !current);
      await dbService.doc(`joinlist/${listObj.id}`).update({
        deleted: deleted,
      });
    }
  };

  return (
    <div className="Itemclass">
      {isBuyer && !deleted? (
        <>
          <div style={{ display: "flex", flexDirection: "row", fontSize: 12 }}>
            <span style={{ width: "16%" }}>{`${listObj.totalprice}`}원</span>
            <span style={{ width: "24%" }}>{`${listObj.account_date}`}</span>
            <span style={{ width: "20%" }}>{`${listObj.account_name}`}</span>
            <span style={{ width: "20%" }}>{`${listObj.account_re}`}</span>
            {!checked ? (
              <input
                style={{ width: "10%" }}
                type="checkbox"
                onChange={check}
                checked
              ></input>
            ) : (
              <input
                style={{ width: "10%", alignSelf: "center" }}
                type="checkbox"
                onChange={check}
              ></input>
            )}
            <span style={{ width: "10%", textAlign: "center" }}>
              {" "}
              <FontAwesomeIcon
                icon={faTrash}
                size="1x"
                color={"#C7D3F7"}
                title="삭제"
                onClick={onDeleteClick}
              />
            </span>
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

/* firebase에서 전체 삭제 버전
  return (
    <div className="Itemclass">
      {isBuyer ? (
        <>
          <div style={{ display: "flex", flexDirection: "row", fontSize: 12 }}>
            <span style={{ width: "16%" }}>{price}원</span>
            <span style={{ width: "24%" }}>{`${listObj.account_date}`}</span>
            <span style={{ width: "20%" }}>{`${listObj.name}`}</span>
            <span style={{ width: "20%" }}>{`${listObj.account_name}`}</span>
            {!checked ? (
              <input
                style={{ width: "10%" }}
                type="checkbox"
                onChange={check}
                checked
              ></input>
            ) : (
              <input
                style={{ width: "10%", alignSelf: "center" }}
                type="checkbox"
                onChange={check}
              ></input>
            )}
            <span style={{ width: "10%", textAlign: "center" }}>
              {" "}
              <FontAwesomeIcon
                icon={faTrash}
                size="1x"
                color={"#C7D3F7"}
                title="삭제"
                onClick={onDeleteClick}
              />
            </span>
          </div>
          <br></br>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

*/