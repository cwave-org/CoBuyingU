import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { collection, where } from "firebase/firestore";

const Detaillist = (userObj) => {
  const location = useLocation();
  let { detailObj } = location.state;
  const itemId = detailObj.id;
  const [itemObj, setItemObj] = useState(detailObj);
  const [editing, setEditing] = useState(false); // Editing
  const navigate = useNavigate();

  // 동기화
  useEffect(async () => {
    let item;
    dbService.collection("startlist").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        if (doc.id == itemId) {
          const item = {
            id: doc.id,
            ...doc.data(),
          };
          setItemObj(item);
        }
      });
    });
  }, []);

  const onJoinlistClick = () => {
    navigate("/buying", { replace: false, state: { detailObj: detailObj } });
  };
  const onShowlistClick = () => {
    navigate("/itemlist", { replace: false, state: { detailObj: detailObj } });
  };

  // Delete Cobuying Item
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      navigate("/");
      await dbService.doc(`startlist/${detailObj.id}`).delete();
      // await storageService.refFromURL(itemObj.attachmentUrl).delete();
    }
  };

  // Edit Cobuying Item
  const [name, setName] = useState(itemObj.name);
  const [itemname, setItemname] = useState(itemObj.itemname);
  const [item, setItem] = useState(itemObj.item);
  const [price, setPrice] = useState(itemObj.price);
  const [deadline, setDeadline] = useState(itemObj.deadline);
  const [etc, setEtc] = useState(itemObj.etc);
  const [account, setAccount] = useState(itemObj.account);
  const [attachment, setAttachment] = useState(itemObj.attachmentUrl);
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`startlist/${itemId}`).update({
      name: name,
      itemname: itemname,
      item: item,
      price: price,
      deadline: deadline,
      account: account,
      etc: etc,
      attachmentUrl: attachment,
    });
    setEditing(false);
  };

  const onChange_name = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };
  const onChange_itemname = (event) => {
    const {
      target: { value },
    } = event;
    setItemname(value);
  };
  const onChange_item = (event) => {
    const {
      target: { value },
    } = event;
    setItem(value);
  };
  const onChange_price = (event) => {
    const {
      target: { value },
    } = event;
    setPrice(value);
  };
  const onChange_deadline = (event) => {
    const {
      target: { value },
    } = event;
    setDeadline(value);
  };
  const onChange_etc = (event) => {
    const {
      target: { value },
    } = event;
    setEtc(value);
  };
  const onChange_account = (event) => {
    const {
      target: { value },
    } = event;
    setAccount(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);

  return (
    <>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <p>
              이름 :
              <input
                value={name}
                onChange={onChange_name}
                type="text"
                placeholder={itemObj.name}
                maxLength={120}
              />
            </p>

            <p>
              상품이름 :
              <input
                value={itemname}
                onChange={onChange_itemname}
                type="text"
                placeholder={itemObj.itemname}
                maxLength={120}
              />
            </p>

            <p>
              품목:
              <input
                value={item}
                onChange={onChange_item}
                type="text"
                placeholder={itemObj.item}
                maxLength={120}
              />
            </p>

            <p>
              가격(원) :
              <input
                value={price}
                onChange={onChange_price}
                type="number"
                placeholder={itemObj.price}
                maxLength={120}
              />
            </p>

            <p>
              마감기한 :
              <input
                value={deadline}
                onChange={onChange_deadline}
                type="date"
                placeholder={itemObj.deadline}
                maxLength={120}
              />
            </p>

            <p>
              기타사항 :
              <input
                value={etc}
                onChange={onChange_etc}
                type="text"
                placeholder={itemObj.etc}
                maxLength={120}
              />
            </p>

            <p>
              계좌(은행/ 계좌번호/입금주명) :
              <input
                value={account}
                onChange={onChange_account}
                type="text"
                placeholder={itemObj.account}
                maxLength={120}
              />
            </p>

            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="수정하기" />
            {attachment && (
              <div>
                <img src={attachment} width="50px" height="50px" />
                <button onClick={onClearAttachment}>Clear</button>
              </div>
            )}
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <div>
            <h3>공구 명 : {itemObj.name}</h3>
            <h3>상품 명 : {itemObj.itemname}</h3>
            <h3>가격 : {itemObj.price}</h3>
            <h3>마감기한 : {itemObj.deadline}</h3>
            <h3>기타사항 : {itemObj.etc}</h3>
            <h3>계좌 : {itemObj.account}</h3>
          </div>
          <div>
            <button className="detaillist submit Btn" onClick={onJoinlistClick}>
              공구 참여하기
            </button>
            <button className="detaillist show Btn" onClick={onShowlistClick}>
              공구 참여자 목록 보기
            </button>
            {userObj && (
              <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default Detaillist;
