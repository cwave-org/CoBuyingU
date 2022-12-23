import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const MyBtn = styled.div`
  width: fit-content;
  margin: 3px 0 3px;
  padding: 0 5px;
  text-align: center;
  height: 10%;
  background-color: #d9d9d9;
  border-radius: 5px;
  color: #5b5b5b;
`;
const Container = styled.div`
  width: 100%;
  margin: auto;
  border: 3px solid #f6f6f6;
  border-radius: 10px;
  background-color: #f6f6f6;
`;
const BtnCon = styled.div`
  /* margin:0 3px; */
  justify-content: space-around;
  display: flex;
`;
const Btn = styled.button`
  width: 48%;
  background-color: #d9d9d9;
  border-radius: 5px;
  color: #5b5b5b;
`;

//사진 다중업로드
const ItemDetails = (props) => {
  const ta = useRef();
  const [attachment, setAttachment] = useState(false);
  const [fileDataList, setFileDataList] = useState([]);
  const [explain, setExplain] = useState();

  const onChangeImage = (e) => {
    //사진이 선택되면 배열에 사진 채워넣기
    // console.log(fileDataList);
    for (const file of e.target.files) {
      //const file of e.target.files
      const theFile = file;
      const reader = new FileReader();

      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        if (fileDataList == null) {
          setFileDataList(result);
        } else {
          setFileDataList((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(theFile);
    }
    setAttachment(true);
  };
  const onClearAttachment = () => {
    setAttachment(false);
    setFileDataList("");
    // setFileDataList(null);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    if (e.target.id === "explain") {
      setExplain(value);
    }
  };

  useEffect(() => {
    //itemDetails[0]번 데이터만 유의미
    if (fileDataList === "") {
      props.setData([
        { id: props.id, url: [], beforeurl: [], content: explain },
      ]);
      //   props.setLostdata([{beforeurl:[]}]);
    } else {
      props.setData([
        { id: props.id, url: [], beforeurl: fileDataList, content: explain },
      ]);
      props.setLostdata([{ beforeurl: fileDataList }]);
    }
    // console.log(props.lostdata);
    //내생각에 explain 바뀔때마다 setData할바에, 걍 onchange일때마다 해당 위치의 파이어베이스에 저장해야될듯
    // console.log(props.data);
  }, [explain, fileDataList, props.id]);

  return (
    <Container>
      <MyBtn>
        <label>
          파일 업로드
          <input
            className="openjoin_input"
            type="file"
            accept="image/*"
            multiple="multiple"
            onChange={onChangeImage}
            style={{ visibility: "hidden", width: "0px" }}
          />
        </label>
      </MyBtn>

      {attachment && fileDataList !== "" && (
        <>
          {fileDataList.map((file, index) => (
            <div key={index} className="attachment">
              <div>
                <img
                  src={file}
                  alt="상세사진"
                  style={{ width: "100px", height: "100px", float: "left" }}
                />
              </div>
            </div>
          ))}
          <Btn onClick={onClearAttachment}>&nbsp;&nbsp;X&nbsp;&nbsp;</Btn>
        </>
      )}
      <input
        id="explain"
        className="openjoin_input"
        value={explain}
        type="textarea"
        style={{ margin: "3px 0 0" }}
        onChange={onChange}
        placeholder="상세 설명을 적어주세요"
        maxLength={300}
      />
    </Container>
  );
};

export default ItemDetails;

/*
//버튼 클릭시 저장
const onEnd=(e)=>{
    setUploaded(true);
}

useEffect(()=>{ 
    props.setData([{id:props.id,url:fileDataList,content:explain}, ...props.data])
},[uploaded]);
*/
