import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import SellingItemEditFactory from "../components/SellingItemEditFactory";

const EachContainer = styled.div`
  width: 100%;
  margin: 3px 3px 15px;
`;
const EachTitle = styled.div`
  font-weight: 600;
  position: relative;
`;
const EachDetail = styled.div`
  margin-top: 1px;
`;
const Detail1 = styled(EachDetail)`
  /* padding: 3px; */
  margin-top: 7px;
`;
const DetailArea = styled.textarea`
  padding: 3px 5px;
  border-radius: 5px;
  resize: none;
  background-color: #f6f6f6;
`;
const Notice = styled.div`
  color: grey;
  position: absolute;
  top: 9px;
  left: 95px;
  font-size: 7px;
`;
/*
const EditForm = ({ itemObj, userObj, itemId }) => {
  let navigate = useNavigate();
  const location = useLocation();
  itemObj = location.state.itemObj;
  itemId = location.state.itemId;

  const [editing, setEditing] = useState(false);
  const [clicked, setClicked] = useState(false);

  //기존 form정보 가져오기
  const [itemname, setItemname] = useState(itemObj.itemname);
  const [name, setName] = useState(itemObj.name);
  const [attachment, setAttachment] = useState(itemObj.attachmentUrl);
  const [deadline, setDeadline] = useState(itemObj.deadline);
  const [link, setLink] = useState(itemObj.link);
  const [account, setAccount] = useState(itemObj.account);
  const [etc, setEtc] = useState(itemObj.etc);
  const [notice, setNotice] = useState(itemObj.notice);
  
  const [item, setItem] = useState("");
  const [itemID, setItemID] = useState(0);
  const [randomIdx, setRandomIdx] = useState(itemObj.randomidx);

  const toggleEditing = () => setEditing((prev) => !prev);
  const [newattachment, setNewAttachment] = useState("");
  const ta = useRef();
  const ta2 = useRef();

  const onCancel = () => {
    navigate(`/selling/detail/${itemId}`);
  };

  const onFormSubmit = async (event) => {
    navigate("/");
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const listObj = {
      randomidx: itemID,
      // randomidx: Math.random(), // 어떤 글인지 추가
      name: name, // 공대표 이름 추가
      itemname: itemname,
      item: item,
      deadline: deadline,
      datetime: Date.now(),
      creatorId: userObj.uid,
      account: account,
      etc: etc,
      notice: notice,
      link: link,
      attachmentUrl,
      userName: userObj.displayName,
      currentNum: 0,
    };
    await dbService.collection("startlist").add(listObj);
    // setItemID(listObj.randomidx);
    setItemname("");
    setName("");
    setItem("");
    setDeadline("");
    setAttachment("");
    setEtc("");
    setLink("");
    setAccount("");
    setNotice("");
  };

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
      name: name, // 공대표 이름 추가
      itemname: itemname,
      item: item,
      deadline: deadline,
      datetime: Date.now(),
      creatorId: userObj.uid,
      account: account,
      etc: etc,
      notice: notice,
      link: link,
      attachmentUrl,
      userName: userObj.displayName,
      currentNum: 0,
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
    if (event.target.id === "itemname") {
      setItemname(value);
    } else if (event.target.id === "nameform") {
      setName(value);
    } else if (event.target.id === "item") {
      setItem(value);
    } else if (event.target.id === "deadline") {
      setDeadline(value);
    } else if (event.target.id === "link") {
      setLink(value);
    } else if (event.target.id === "etc") {
      if (ta.current.scrollHeight > 90) {
        ta.current.style.height = ta.current.scrollHeight + "px";
      }
      setEtc(value);
    } else if (event.target.id === "account") {
      setAccount(value);
    } else if (event.target.id === "notice") {
      if (ta2.current.scrollHeight > 90) {
        ta2.current.style.height = ta2.current.scrollHeight + "px";
      }
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

  return (
    <>
      <form className="openjoin_container">
      <p>공구 열기</p>
      <EachContainer>
        <EachTitle>✔️ 상품이름</EachTitle>
        <EachDetail>
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
        </EachDetail>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 공대표 이름</EachTitle>
        <EachDetail>
          <input
            className="openjoin_input"
            id="nameform"
            type="text"
            placeholder={userObj.displayName}
            onChange={onChange}
            value={name}
            required
          />
        </EachDetail>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 상품 대표사진</EachTitle>
        <Detail1>
          <input
            className="openjoin_input"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          {attachment && (
            <div className="attatchment">
              <img src={attachment} alt="대표사진" />
              <button className="default_Btn" onClick={onClearAttachment}>
                Clear
              </button>
            </div>
          )}
        </Detail1>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 마감기한</EachTitle>
        <Detail1>
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
        </Detail1>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 카테고리</EachTitle>
        <EachDetail>문구류</EachDetail>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 오픈채팅방 링크</EachTitle>
        <EachDetail>
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
        </EachDetail>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 계좌(은행/계좌번호/입금주명)</EachTitle>
        <EachDetail>
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
        </EachDetail>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 상세설명</EachTitle>
        <EachDetail>
          <DetailArea
            id="etc"
            className="openjoin_input"
            ref={ta}
            rows={3}
            value={etc}
            onChange={onChange}
            type="text"
            placeholder="현장배부/택배배송 등 상세설명을 작성해주세요."
            // maxLength={10000}
          />
        </EachDetail>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 주의사항</EachTitle>
        <EachDetail>
          <DetailArea
            id="notice"
            className="openjoin_input"
            ref={ta2}
            rows={3}
            value={notice}
            onChange={onChange}
            type="text"
            placeholder="환불 등 주의사항을 작성해주세요."
            // maxLength={10000}
          />
        </EachDetail>
      </EachContainer>

      <EachContainer>
        <EachTitle>
          ✔️ 상품목록 <Notice>작성후 하단의 완료버튼을 눌러주세요</Notice>
        </EachTitle>
        <SellingItemEditFactory
          userObj={userObj}
          randomIdx={randomIdx}
        />
      </EachContainer>
     
      <div>
        <button className="default_Btn_Right" onClick={onCancel}>
          취소
        </button>
        <button className="default_Btn_Right" onClick={onSubmit}>
          제출
        </button>
      </div>
    </form>
    </>
  );
};
export default EditForm;
*/

/*
 <EachContainer>
        <EachTitle>
          ✔️ 상품목록 <Notice>작성후 하단의 완료버튼을 눌러주세요</Notice>
        </EachTitle>
        <SellingItemFactory
          userObj={userObj}
          itemID={itemID}
          setClicked={setClicked}
        />
      </EachContainer>
*/