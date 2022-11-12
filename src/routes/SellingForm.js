import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { useNavigate } from "react-router-dom";
import AddPhoto from "../components/SOOM/AddPhoto";

const SellingForm = ({ userObj }) => {
  const [itemname, setItemname] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [etc, setEtc] = useState("");
  const [account, setAccount] = useState("");
  const [attachment, setAttachment] = useState("");
  const navigate = useNavigate();

  const [link, setLink] = useState("");

  const onSubmit = async (event) => {
    navigate("/");
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const listObj = {
      randomidx: Math.random(), // 어떤 글인지 추가
      itemname: itemname,
      item: item,
      price: price,
      deadline: deadline,
      datetime: Date.now(),
      creatorId: userObj.uid,
      account: account,
      etc: etc,
      link: link,
      attachmentUrl,
      userName: userObj.displayName,
    };
    await dbService.collection("startlist").add(listObj);
    setItemname("");
    setItem("");
    setPrice("");
    setDeadline("");
    setAttachment("");
    setEtc("");
    setLink("");
    setAccount("");
  };

  const onCancel = () => {
    navigate("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "itemname") {
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
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);

  return (
    <form className="openjoin_container" onSubmit={onSubmit}>
      <p>공구 열기</p>

      <p className="openjoin_que">
        <span>✔️ 상품이름: </span>
        <input
          id="itemname"
          className="openjoin_input"
          value={itemname}
          onChange={onChange}
          type="text"
          placeholder="상품이름"
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
          placeholder="품목"
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
          placeholder="가격(원)"
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
        <span className="openjoin_long">✔️ 오픈채팅방 링크: </span>
        <input
          id="link"
          className="openjoin_input"
          value={link}
          onChange={onChange}
          type="text"
          placeholder="오픈채팅방링크"
          maxLength={150}
          style={{ marginBottom: 5 }}
        />
      </p>
      <AddPhoto />

      <p className="openjoin_que">
        <span className="openjoin_long">
          ✔️ 계좌(은행/ 계좌번호/입금주명):{" "}
        </span>
        <input
          id="account"
          className="openjoin_input"
          value={account}
          onChange={onChange}
          type="text"
          placeholder="계좌(은행/ 계좌번호/입금주명)"
          maxLength={120}
          style={{ marginBottom: 5 }}
          required
        />
      </p>

      <p className="openjoin_que">
        <span className="openjoin_long">✔️ 사진 : </span>

        <div>
          <input
            className="openjoin_input"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          {attachment && (
            <div className="attatchment">
              <img src={attachment} />
              <button className="default_Btn" onClick={onClearAttachment}>
                Clear
              </button>
            </div>
          )}
        </div>
      </p>

      <p className="openjoin_que">
        <span className="openjoin_long">✔️ 기타사항 : </span>
        <textarea
          id="etc"
          className="openjoin_input"
          value={etc}
          onChange={onChange}
          type="text"
          placeholder="최대 길이는 1000자입니다."
          maxLength={10000}
        />
      </p>
      <div>
        <button className="default_Btn_Right" onClick={onCancel}>
          취소
        </button>
        <button className="default_Btn_Right" type="submit">
          제출
        </button>
      </div>
    </form>
  );
};
export default SellingForm;
