import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
const EditForm=({itemObj, userObj, itemId})=>{
    let navigate = useNavigate();
    const location=useLocation();
    itemObj = location.state.itemObj;
    itemId=location.state.itemId;
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(itemObj.name);
    const [itemname, setItemname] = useState(itemObj.itemname);
    const [item, setItem] = useState(itemObj.item);
    const [price, setPrice] = useState(itemObj.price);
    const [deadline, setDeadline] = useState(itemObj.deadline);
    const [etc, setEtc] = useState(itemObj.etc);
    const [account, setAccount] = useState(itemObj.account);
    const [link, setLink] = useState("");
    const [attachment, setAttachment] = useState(itemObj.attachmentUrl);
    const toggleEditing = () => setEditing((prev) => !prev);
    const [newattachment, setNewAttachment] = useState("");
    const onCancel=()=>{
      navigate(`/selling/detail/${itemId}`);
    }
    const onSubmit = async (event) => {
      event.preventDefault();
      toggleEditing();
      let attachmentUrl = "";
      if (newattachment !== "") {
        const attachmentRef = storageService
          .ref()
          .child(`${userObj.uid}/${uuidv4()}`);
        const response = await attachmentRef.putString(newattachment, "data_url");
        attachmentUrl = await response.ref.getDownloadURL();
        await dbService.doc(`startlist/${itemId}`).update({
          attachmentUrl,
        });
      }
      await dbService.doc(`startlist/${itemId}`).update({
        name: name,
        itemname: itemname,
        item: item,
        price: price,
        deadline: deadline,
        account: account,
        etc: etc,
      });
      navigate(`/selling/detail/${itemId}`, {
        replace: false,
      });
    };
  
   
    const onClearAttachment = () => setAttachment(null);
    const onChange = (event) => {
        const {
          target: { value },
        } = event;
        if (event.target.id === "name") {
          setName(value);
        } else if (event.target.id === "itemname") {
          setItemname(value);
        } else if (event.target.id === "item") {
          setItem(value);
        } else if (event.target.id === "price") {
          setPrice(value);
        } else if (event.target.id === "deadline") {
          setDeadline(value);
        } else if (event.target.id === "link") {
          setLink(value);
        } else if (event.target.id === "etc") {
          setEtc(value);
        } else if (event.target.id === "account") {
          setAccount(value);
        }
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
          setNewAttachment(result);
        };
        reader.readAsDataURL(theFile);
      };
    return(
        <>
        <form className="openjoin_container" onSubmit={onSubmit}>
            <p className="openjoin_que">
              <span>✔️ 이름: </span>
              <input
                id="name"
                className="openjoin_input"
                value={name}
                onChange={onChange}
                type="text"
                placeholder={itemObj.name}
                maxLength={120}
                required
              />
            </p>

            <p className="openjoin_que">
              <span>✔️ 상품이름: </span>
              <input
                id="itemname"
                className="openjoin_input"
                value={itemname}
                onChange={onChange}
                type="text"
                placeholder={itemObj.itemname}
                maxLength={120}
                required
              />
            </p>

            <p className="openjoin_que">
              <span>✔️ 품목: </span>
              <input
                id="item"
                className="openjoin_input"
                value={item}
                onChange={onChange}
                type="text"
                placeholder={itemObj.item}
                maxLength={120}
                required
              />
            </p>

            <p className="openjoin_que">
              <span>✔️ 가격(원): </span>
              <input
                id="price"
                className="openjoin_input"
                value={price}
                onChange={onChange}
                type="number"
                placeholder={itemObj.price}
                maxLength={120}
                required
              />
            </p>
            <p className="openjoin_que">
              <span>✔️ 마감기한: </span>
              <input
                id="deadline"
                className="openjoin_input"
                value={deadline}
                onChange={onChange}
                type="date"
                placeholder="마감기한"
                maxLength={120}
                required
              />
            </p>
            <p className="openjoin_que">
              <span className="openjoin_long">✔️ 오픈채팅방 링크 : </span>
              <input
                id="link"
                className="openjoin_input"
                value={link}
                onChange={onChange}
                type="text"
                placeholder={itemObj.link}
                maxLength={150}
                style={{ marginBottom: 5 }}
              />
            </p>
            <p className="openjoin_que">
              <span className="openjoin_long">
                ✔️ 계좌(은행/ 계좌번호/입금주명) :{" "}
              </span>
              <input
                id="account"
                className="openjoin_input"
                value={account}
                onChange={onChange}
                type="text"
                placeholder={itemObj.account}
                maxLength={120}
                style={{ marginBottom: 5 }}
                required
              />
            </p>
            <p className="openjoin_que">
              <span className="openjoin_long">✔️ 사진 : </span>
              <input
                className="openjoin_input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
              {attachment && (
                <div className="attatchment">
                  <img src={attachment} />
                  <button onClick={onClearAttachment}>Clear</button>
                </div>
              )}
            </p>
            <p className="openjoin_que">
              <span className="openjoin_long">✔️ 기타사항 : </span>
              <input
                id="etc"
                className="openjoin_input"
                value={etc}
                onChange={onChange}
                type="text"
                placeholder={itemObj.etc}
                maxLength={120}
              />
              <br />
              <br />
              <div>
                <button
                  className="default_Btn_Right"
                  onClick={onCancel}
                  style={{ margin: "1%" }}
                >
                  취소
                </button>
                <button
                  className="default_Btn_Right"
                  type="submit"
                  style={{ margin: "1%" }}
                  onClick={onSubmit}
                >
                  제출
                </button>
              </div>
            </p>
          </form>
        </>
    );
};
export default EditForm;