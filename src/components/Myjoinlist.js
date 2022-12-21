import { queryByTestId } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "../fbase";

const Myjoinlist = ({ listObj, isOwner }) => {
  const [name, setName] = useState("");
  const [exist, setExist] = useState(false);
  const [link,setLink]=useState("");
  let navigate = useNavigate();
  let myObj;
  useEffect(() => {
    let dblists = dbService
      .collection("startlist")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().randomidx == `${listObj.randomidx}`) {
            setLink(doc.data().link);
            myObj = {
              id: doc.id,
              ...doc.data(),
            };
            setExist(true);
            setName(myObj.itemname);
          }
        });
      });
  }, []);

  const onShowdetailClick = async () => {
    let dblists = await dbService
      .collection("startlist")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().randomidx == `${listObj.randomidx}`) {
            myObj = {
              id: doc.id,
              ...doc.data(),
            };
          }
        });
      });

    navigate(`/selling/detail/${myObj.id}`);
  };

  const onShowbuyClick = () => {
    const detailObj = "init";
    navigate("/buying/detail", {
      replace: false,
      state: { detailObj: listObj },
    });
  };

  return (
    <>
      <div className="Itemclass">
        { isOwner && exist ? (
          <>
            <span className="mysubform" onClick={onShowdetailClick}>
              {`${name}`}
            </span>
            <span className="myformshow" onClick={onShowbuyClick}>
              제출 폼 확인
            </span>
            <span className="myitemOka">
              오카방
              <a href={link}>
                <img src="img/kakaotalk.png" alt="오카방" height={20} width={20} />
              </a>
            </span>
          </>
        ) : (
          <>
          </>
        )}
      </div>
    </>
  );
};
export default Myjoinlist;