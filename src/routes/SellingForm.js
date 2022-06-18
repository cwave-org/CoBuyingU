import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { useNavigate } from "react-router-dom";

const SellingForm = ({ userObj }) => {
  const [name, setName] = useState("");
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
      name: name,
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
    };
    await dbService.collection("startlist").add(listObj);
    setName("");
    setItemname("");
    setItem("");
    setPrice("");
    setDeadline("");
    setAttachment("");
    setEtc("");
    setLink("");
    setAccount("");
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
  const onChange_link = (event) => {
    const {
      target: { value },
    } = event;
    setLink(value);
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
    <form className="openjoin_container" onSubmit={onSubmit}>
      <p>공구 열기</p>

      <p className="openjoin_que">
       <span>✔️ 이름:</span>  
        <input 
          className="openjoin_input"
          value={name}
          onChange={onChange_name}
          type="text"
          placeholder="이름"
          maxLength={120}
        />
      </p>

      <p className="openjoin_que">
      <span>✔️ 상품이름: </span>
      <input
        className="openjoin_input"
        value={itemname}
        onChange={onChange_itemname}
        type="text"
        placeholder="상품이름"
        maxLength={120}
      />
      </p>

      <p className="openjoin_que">
      <span>✔️ 품목: </span>
      <input
        className="openjoin_input"
        value={item}
        onChange={onChange_item}
        type="text"
        placeholder="품목"
        maxLength={120}
      />
      </p>

      <p className="openjoin_que">
      <span>✔️ 가격(원): </span>
      <input
        className="openjoin_input"
        value={price}
        onChange={onChange_price}
        type="number"
        placeholder="가격(원)"
        maxLength={120}
      />
      </p>

      <p className="openjoin_que">
      <span>✔️ 마감기한 : </span>
      <input
        className="openjoin_input"
        value={deadline}
        onChange={onChange_deadline}
        type="date"
        placeholder="마감기한"
        maxLength={120}
      />
      </p>

      <p className="openjoin_que">
      <span className="openjoin_long">✔️ 오픈채팅방 링크 : </span>
      <input
        className="openjoin_input"
        value={link}
        onChange={onChange_link}
        type="text"
        placeholder="오픈채팅방링크"
        maxLength={150}
        style={{ marginBottom: 5 }}
      />
      </p>

      <p className="openjoin_que">
      <span className="openjoin_long">✔️ 계좌(은행/ 계좌번호/입금주명) : </span>
      <input
        className="openjoin_input"
        value={account}
        onChange={onChange_account}
        type="text"
        placeholder="계좌(은행/ 계좌번호/입금주명)"
        maxLength={120}
        style={{ marginBottom: 5 }}
      />
      </p>

      <p className="openjoin_que">
      <span className="openjoin_long">✔️ 첨부파일 : </span>
      <input className="openjoin_input" type="file" accept="image/*" onChange={onFileChange}/>
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
      </p>

      <p className="openjoin_que">
      <span className="openjoin_long">✔️ 기타사항 : </span>
      <input
        className="openjoin_input"
        value={etc}
        onChange={onChange_etc}
        type="text"
        placeholder="기타사항"
        maxLength={120}
      />
      <input type="submit" value="제출" />
      </p>
    </form>
  );
};
export default SellingForm;
