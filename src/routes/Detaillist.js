import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import QnA from "../components/QnA";

const Detaillist = ({ userObj }) => {
  const location = useLocation();
  let { detailObj } = location.state;
  const [checked, setChecked] = useState(true);
  const [qna, setQna] = useState("");
  const [qnas, setQnas] = useState([]);

  const navigate = useNavigate();
  const onJoinlistClick = () => {
    navigate("/buying", { replace: false, state: { detailObj: detailObj } });
  };
  const onShowlistClick = () => {
    navigate("/itemlist", { replace: false, state: { detailObj: detailObj } });
  };
  const checkObj = {
    check: !checked,
    createdAt: Date.now(),
    creatorId: userObj.uid,
    userName: userObj.displayName,
  };

  useEffect(() => {
    dbService
      .doc(`startlist/${detailObj.id}`)
      .collection("scrap")
      .onSnapshot((snapshot) => {
        const checkArray = snapshot.docs.map((doc) => ({
          id: userObj.uid,

          ...doc.data(),
        }));
        // 스크랩 여부 확인 후 체크박스 조정(?)
        if (checkArray.length > 0) {
          if (checkArray[0].id == userObj.uid) {
            setChecked(false);
          }
        }
      });
  }, []);

  useEffect(() => {
    dbService
      .doc(`startlist/${detailObj.id}`)
      .collection("QnA")
      .onSnapshot((snapshot) => {
        const qnaArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQnas(qnaArray);
      });
  }, []);

  const QnAonSubmit = async (event) => {
    event.preventDefault();
    await dbService
      .collection("startlist")
      .doc(detailObj.id)
      .collection("QnA")
      .add({
        text: qna,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        checked: false,
        userName: userObj.displayName,
      });
    setQna("");
  };

  const QnAonChange = (event) => {
    const {
      target: { value },
    } = event;
    setQna(value);
  };

  // 송금완료 체크박스
  const check = async (event) => {
    setChecked((current) => !current);
    if (checked) {
      // 스크랩
      await dbService
        .doc(`startlist/${detailObj.id}/scrap/${userObj.uid}`)
        .set(checkObj);
      await dbService
        .doc(`startlist/${detailObj.id}/scrap/${userObj.uid}`)
        .update({
          check: !check,
        });
      dbService
        .doc(`startlist/${detailObj.id}/scrap/${userObj.uid}`)
        .get(checkObj);
      console.log(!check);
    } else {
      // 스크랩 취소
      await dbService
        .doc(`startlist/${detailObj.id}`)
        .collection("scrap")
        .doc(userObj.uid)
        .delete();
    }
  };

  return (
    <div>
      <h2>📢 공지사항</h2>
      <br></br>

      <>
        <div>
          <h3>공구 명 : {detailObj.name}</h3>
          <h3>상품 명 : {detailObj.itemname}</h3>
          <h3>가격 : {detailObj.price}</h3>
          <h3>마감기한 : {detailObj.deadline}</h3>
          <h3>기타사항 : {detailObj.etc}</h3>
          <h3>계좌 : {detailObj.account}</h3>
        </div>
        <div>
          <button className="detaillist submit Btn" onClick={onJoinlistClick}>
            공구 참여하기
          </button>
          <button className="detaillist show Btn" onClick={onShowlistClick}>
            공구 참여자 목록 보기
          </button>
        </div>
        <div>
          {!checked ? (
            <input type="checkbox" onChange={check} checked></input>
          ) : (
            <input type="checkbox" onChange={check}></input>
          )}
        </div>

        <div>
          <a href={detailObj.link}>
            <img src="img/kakaotalk.png" height={50} width={50} />
          </a>
        </div>

        <div>
          <p>♥무엇이든지 물어보세요♥</p>
          <>
            <div>
              <form onSubmit={QnAonSubmit}>
                <input
                  type="text"
                  placeholder="🙏🏼수정은 불가능하세요.🙏🏼"
                  value={qna}
                  onChange={QnAonChange}
                />

                <button type="submit">Upload</button>
              </form>
            </div>
          </>
        </div>
        <>
          {qnas.map((qna) => (
            <QnA
              key={qna.id}
              qnaObj={qna}
              isOwner={qna.creatorId === userObj.uid}
              userObj={userObj}
              detailObj={detailObj}
            />
          ))}
        </>
      </>
    </div>
  );
};
export default Detaillist;
