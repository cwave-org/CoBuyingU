import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { useNavigate } from "react-router-dom";
import SellingItemFactory from "../components/SellingItemFactory";
import styled from "styled-components";
import DateFactory from "../components/DateFactory";

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
const Notice2= styled.div`
  color: grey;
  position: absolute;
  top: 9px;
  left: 130px;
  font-size: 7px;
`;

const SellingForm = ({ userObj }) => {

  const [itemname, setItemname] = useState("");
  const [name, setName] = useState("");
  const [attachment, setAttachment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");
  const [account, setAccount] = useState("");
  const [etc, setEtc] = useState("");
  const [notice, setNotice] = useState("");
  const [giving, setGiving] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [clickeddate, setClickedDate] = useState(false);

  const [item, setItem] = useState("");
  const [itemID, setItemID] = useState(0);
  
  const navigate = useNavigate();
  //const ta = useRef();
  //const ta2 = useRef();
 
  useEffect(() => {
    setItemID(Math.random());
  }, []);
  const onFormSubmit = async (event) => {
    // if(clicked){
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
    // }else{
    // window.alert("상품추가 완료버튼을 눌러주셔야 제출 가능합니다");
    // }
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
    } else if (event.target.id === "nameform") {
      setName(value);
    } else if (event.target.id === "item") {
      setItem(value);
    } else if (event.target.id === "deadline") {
      setDeadline(value);
    } else if (event.target.id === "link") {
      setLink(value);
    } else if (event.target.id === "etc") {
      /*
      if (ta.current.scrollHeight > 90) {
        ta.current.style.height = ta.current.scrollHeight + "px";
      }
      */
      setEtc(value);
    } else if (event.target.id === "account") {
      setAccount(value);
    } else if (event.target.id === "notice") {
      /*
      if (ta2.current.scrollHeight > 90) {
        ta2.current.style.height = ta2.current.scrollHeight + "px";
      }*/
      setNotice(value);
    }
  };

  const onRadioClick = (e) => {
    if (e.target.value === "parcel") {
      setGiving(1);
    } else if (e.target.value === "site") {
      setGiving(2);
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
      console.log(result)
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
  const onCheckForm = () => {
    if (clicked&&clickeddate) {
      var result= window.confirm("정말로 폼을 제출하시겠습니까?");
      if(result){
        onFormSubmit();
      }
    // } else if(!clicked) {
    //   window.alert("상품추가 완료버튼을 눌러주셔야 제출 가능합니다");
    // } else if(!clickeddate){
    //   window.alert("현장배부 날짜추가 완료버튼을 눌러주셔야 제출 가능합니다");
    }
  };
  return (
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
        <EachTitle>✔️ 배송여부</EachTitle>
        <EachDetail>
          <input
            type="radio"
            //name="theme"
            value="site"
            onClick={onRadioClick}
          />
          현장배부{" "}
          <input
            type="radio"
            //name="theme"
            value="parcel"
            disabled
            onClick={onRadioClick}
          />
          택배배송
        </EachDetail>
      </EachContainer>
      {giving === 0 ? (
        <EachContainer></EachContainer>
      ) : giving === 1 ? ( //택배배송 선택한 경우
        <EachContainer></EachContainer>
      ) : (
        <EachContainer>
          <EachTitle>✔️ 현장배부 날짜 
            <Notice2>현장배부 날짜 및 시간을 작성해주세요</Notice2>
          </EachTitle>
          <EachDetail>
            <DateFactory
              userObj={userObj}
              itemID={itemID}
              setClicked={setClickedDate}
            />
          </EachDetail>
        </EachContainer>
      )}

      <EachContainer>
        <EachTitle>✔️ 상세설명</EachTitle>
        <EachDetail>
          <DetailArea
            id="etc"
            className="openjoin_input"
            //ref={ta}
            rows={3}
            value={etc}
            onChange={onChange}
            type="text"
            placeholder="추가 상세설명을 작성해주세요."
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
            //ref={ta2}
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
        <SellingItemFactory
          userObj={userObj}
          itemID={itemID}
          setClicked={setClicked}
        />
      </EachContainer>

      <div>
        <button className="default_Btn_Right" onClick={onCancel}>
          취소
        </button>
        <button className="default_Btn_Right" onClick={onCheckForm}>
          제출
        </button>
      </div>
    </form>
  );
};
export default SellingForm;
