import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

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

const SellingForm2 = ({listObj,userObj}) => {
//const {id} = useParams();
  const location = useLocation();
  const { link } = location.state;
  const  id = location.state.id;
 //console.log(id)
  const [itemname2, setItemname2] = useState("");
  const [attachment2, setAttachment2] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const FinalSubmit = () => {
    navigate("/");
  };
  const onFormSubmit = async (event) => {
    
    let attachmentUrl = "";
    if (attachment2 !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment2, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const ItemObj = {
      itemname2: itemname2,
      title:title,
      text:text,
      attachmentUrl,
    };
    await dbService.doc(`startlist/${id}`).collection("Item").add(ItemObj);
    // setItemID(listObj.randomidx);
    setItemname2("");
    setTitle("");
    setText("");
    setAttachment2("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "itemname2") {
      setItemname2(value);
    } else if (event.target.id === "title") {
      setTitle(value);
    } else if (event.target.id === "text") {
      setText(value);
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
      setAttachment2(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment2(null);

  const onCancel = () => {
    navigate("/selling");
  };
  const onCheckForm = () => {

    var result= window.confirm("정말로 폼을 제출하시겠습니까?");

    onFormSubmit();

  };
  return (
    <>
    <form className="openjoin_container">
        <p>물품 추가하기</p>
        <EachContainer>
        <EachTitle>✔️ 상품이름</EachTitle>
        <EachDetail>
          <input
            id="itemname2"
            className="openjoin_input"
            value={itemname2}
            onChange={onChange}
            type="text"
            placeholder="상품이름"
            maxLength={120}
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
          {attachment2 && (
            <div className="attatchment">
              <img src={attachment2} alt="대표사진" />
              <button className="default_Btn" onClick={onClearAttachment}>
                Clear
              </button>
            </div>
          )}
        </Detail1>
      </EachContainer>

      <EachContainer>
        <EachTitle>✔️ 상세설명</EachTitle>
        <EachDetail>
          <DetailArea
            id="text"
            className="openjoin_input"
            value={text}
            onChange={onChange}
            type="text"
            placeholder="추가 상세설명을 작성해주세요."
            // maxLength={10000}
          />
        </EachDetail>
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

    <button className="default_Btn_Right" onClick={FinalSubmit }>
          업로드
        </button>
    </>
  );
};
export default SellingForm2;
