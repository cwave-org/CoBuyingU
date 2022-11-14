import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { useNavigate } from "react-router-dom";
import SellingItemFactory from "../components/SellingItemFactory";

const SellingForm = ({ userObj }) => {

  const [name, setName] = useState("");
  const [eachdata,setEachData]=useState("");
  const [itemname, setItemname] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [etc, setEtc] = useState("");
  const [account, setAccount] = useState("");
  const [attachment, setAttachment] = useState("");
  const [itemID,setItemID]=useState(0);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const [link, setLink] = useState("");
  useEffect(()=>{
    setItemID(Math.random());
  },[]);
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
      randomidx:itemID,
      // randomidx: Math.random(), // 어떤 글인지 추가
      name: name,// 공대표 이름 추가
      itemname: itemname,
      item: item,
      price: price,
      deadline: deadline,
      datetime: Date.now(),
      creatorId: userObj.uid,
      account: account,
      etc: etc,
      notice: notice,
      link: link,
      attachmentUrl,
      userName: userObj.displayName,
    };
    await dbService.collection("startlist").add(listObj);
    // setItemID(listObj.randomidx);
    setItemname("");
    setName("");
    setItem("");
    setPrice("");
    setDeadline("");
    setAttachment("");
    setEtc("");
    setLink("");
    setAccount("");
    setNotice("");
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
    } 
    else if (event.target.id === "nameform") {
      setName(value);
    }else if (event.target.id === "item") {
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
    else if (event.target.id === "notice") {
      setNotice(value);
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

      <p>✔️ 상품이름 </p>
      <p className="openjoin_que">
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

      <p>✔️ 공대표 이름 </p>
      <p className="openjoin_que">
        <input
          className="openjoin_input"
          id="nameform"
          type="text"
          placeholder={userObj.displayName}
          onChange={onChange}
          value={name}
          required
        />
      </p>

      <p>✔️ 대표사진 </p>
      <p className="openjoin_que">
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

      <p>✔️ 마감기한 </p>
      <p className="openjoin_que">
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

      <p>✔️ 카테고리 </p>  
      <p>문구류</p>

      <p>✔️ 오픈채팅방 링크 </p>
      <p className="openjoin_que">
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

      <p> ✔️ 계좌(은행/ 계좌번호/입금주명) </p>
      <p className="openjoin_que">
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


        <div>
          <input
            className="openjoin_input"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          {attachment && (
            <div className="attatchment">
              <img src={attachment} alt="대표사진"/>
              <button className="default_Btn" onClick={onClearAttachment}>
                Clear
              </button>
            </div>
          )}
        </div>
      </p>
      {/*<p className="openjoin_que">
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
          </p>*/}

      
      
      {/* 나연씨 각 옵션마다 그 안에 아래 컴포넌트를 넣어주면 될겁니당
      근데 각 옵션에 따라 선언되는게 꼬인다면.. 내 코드에서 약간 수정필요할수도 있어서 에러나면 걍 나한테 말해죵!!*/}
      <AddPhoto setEachData={setEachData} />


      <p>✔️ 상세설명 </p>
      <p className="openjoin_que">
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

      <p>✔️ 주의사항 </p>
      <p className="openjoin_que">
        <textarea
          id="notice"
          className="openjoin_input"
          value={notice}
          onChange={onChange}
          type="text"
          placeholder="최대 길이는 1000자입니다."
          maxLength={10000}
        />
      </p>
      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
        <SellingItemFactory userObj={userObj} itemID={itemID} />
      </div>
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
