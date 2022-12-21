import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faStar,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as FaStarRegular } from "@fortawesome/free-regular-svg-icons";
import Kakao from "../components/Kakao";
import styled from "styled-components";
import QnA from "../components/QnA";
import { useParams } from "react-router-dom";
import EachDetail from "../components/SOOM/EachDetail";
const Btn=styled.button`
  margin: 5px;
  width: 48%;
  background-color: #F26656;
  border-radius:5px;
  color: white;
`;
const Btn1=styled(Btn)`
  background-color: #bbdcf7;
  width: 50%;
  color: rgb(85, 141, 245);

`
const Detaillist = ({ userObj }) => {
  const { id } = useParams();
  const [isLodded, setIsLodded] = useState(false);
  const [shareclick, setShareClick] = useState(false);
  const [detailObj, setDetailObj] = useState([]);
  const itemId = id;
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(true);
  const [qna, setQna] = useState("");
  const [qnas, setQnas] = useState([]);
  const [itemObj, setItemObj] = useState(detailObj);
  const [eachObj, setEachObj] = useState([]);
  const [today, setToday] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    dbService
      .collection("startlist")
      .doc(id)
      .get()
      .then((doc) => {
        setDetailObj(doc.data());
        const item = {
          id: doc.id,
          ...doc.data(),
        };
        setItemObj(item);
        setIsLodded(true);
        //console.log(item.deadline);
        dbService
          .doc(`startlist/${id}`)
          .collection("Item")
          .onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
              setEachObj([...eachObj, doc.data()]);
            });
          });
      });
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1 < 9
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1) +
      "-" +
      (today.getDate() < 9 ? "0" + today.getDate() : today.getDate());
    setToday(date);
  }, []);

  //  },[eachId]);
  // 동기화
  useEffect(() => {
    dbService.collection("startlist").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        if (doc.id === itemId) {
          const item = {
            id: doc.id,
            ...doc.data(),
          };
          setItemObj(item);
          setIsLodded(true);
        } else if (doc.id == id) {
          const item = {
            id: doc.id,
            ...doc.data(),
          };
          setItemObj(item);
          setIsLodded(true);
        }
      });
    });
  }, []);
  const toggleEditing = () => {
    navigate("/selling/edit", {
      replace: false,
      state: { itemObj: itemObj, itemId: id },
    });
  };
  const [bucket, setBucket] = useState(false);

  const onJoinlistClick = () => {
    navigate("/buying", {
      replace: false,
      state: {
        detailObj: detailObj,
        itemId: id,
      },
    });
  };
  const onFinishClick=()=>{
    var done = window.confirm("정말로 공구를 마감하시겠습니까?");
    if(done){
      // event.preventDefault();
      dbService
      .collection("startlist")
      .doc(id)
      .update({done:true});
    }
  }
  const onShowlistClick = () => {
    navigate("/itemlist", {
      replace: false,
      state: {
        buyerindex: detailObj.randomidx,
        filename: detailObj.itemname,
      },
    });
  };

  // Delete Cobuying Item
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 공구를 삭제하실 건가요?");
    if (ok) {
      navigate("/");
      async function deleteCollection(dbService, collectionPath) {
        const collectionRef = dbService.collection(collectionPath);
        const query = collectionRef;
        //debugger
        return new Promise((resolve, reject) => {
          deleteQueryBatch(dbService, query, resolve).catch(reject);
        });
      }

      async function deleteCollection2(dbService, collectionPath) {
        const collectionRef = dbService.collection(collectionPath);
        const query = collectionRef;
        //debugger
        return new Promise((resolve, reject) => {
          deleteQueryBatch(dbService, query, resolve).catch(reject);
        });
      }

      async function deleteQueryBatch(dbService, query, resolve) {
        const snapshot = await query.get();

        const batchSize = snapshot.size;
        if (batchSize === 0) {
          // When there are no documents left, we are done
          resolve();
          return;
        }

        // Delete documents in a batch
        const batch = dbService.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(dbService, query, resolve);
        });
      }

      //await dbService.doc(`startlist/${id}`).delete();
      deleteCollection(
        dbService,
        `startlist/${id}/QnA/${qnaObj.creatorId}/comments`
      );
      await dbService
        .doc(`startlist/${id}`)
        .collection("QnA")
        .doc(`${qnaObj.creatorId}`)
        .delete();

      deleteCollection2(dbService, `startlist/${id}/QnA`);
      await dbService.doc(`startlist/${id}`).delete();

      deleteCollection2(dbService, `startlist/${id}/scrap`);
      await dbService.doc(`startlist/${id}`).delete();
    }
    //await storageService.refFromURL(itemObj.attachmentUrl).delete();
  };

  // Edit Cobuying Item

  const qnaObj = {
    text: qna,
    createdAt: Date.now(),
    creatorId: userObj.uid,
    userName: userObj.displayName,
  };

  // 댓글
  useEffect(() => {
    dbService
      .doc(`startlist/${id}`)
      .collection("QnA")
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        setBucket(false);
        setQnas([]);
        snapshot.docs.map((doc) => {
          // 이미 문의댓글을 달은 경우
          if (doc.id === userObj.uid) {
            setBucket(true);
          }
          const qna = {
            id: doc.id,
            ...doc.data(),
          };
          setQnas((data) => [...data, qna]);
        });
      });
  }, []);

  const QnAonSubmit = async (event) => {
    event.preventDefault();
    setBucket(true);
    await dbService
      .collection("startlist")
      .doc(id)
      .collection("QnA")
      .doc(userObj.uid)
      .set(qnaObj);
    dbService
      .collection("startlist")
      .doc(id)
      .collection("scrap")
      .doc(userObj.uid)
      .get({
        text: qna,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        checked: false,
        userName: userObj.displayName,
      });
    setQna("");
  };

  const checkObj = {
    check: !checked,
    createdAt: Date.now(),
    creatorId: userObj.uid,
    userName: userObj.displayName,
  };

  useEffect(() => {
    dbService
      .doc(`startlist/${id}`)
      .collection("scrap")
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          // 스크랩 여부 확인 후 체크박스 조정(?)
          if (doc.id === userObj.uid) {
            setChecked(false);
          }
        });
      });
  }, []);

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
      await dbService.doc(`startlist/${id}/scrap/${userObj.uid}`).set(checkObj);
      await dbService.doc(`startlist/${id}/scrap/${userObj.uid}`).update({
        check: !check,
      });
      dbService.doc(`startlist/${id}/scrap/${userObj.uid}`).get(checkObj);
    } else {
      // 스크랩 취소
      await dbService
        .doc(`startlist/${id}`)
        .collection("scrap")
        .doc(userObj.uid)
        .delete();
    }
  };
  const onShareClick = () => {
    setShareClick(true);
  };
  return (
    <>
      {isLodded ? (
        <>
          <div className="detaillist_content">
            <div>
              <Title>{itemObj.itemname}</Title>
              {itemObj.attachmentUrl && (
                <img
                  src={itemObj.attachmentUrl}
                  className="detaillist_img"
                  alt="메인사진"
                />
              )}
              <Br />
              <div className="detaillist_scr">
                {!checked ? (
                  <FontAwesomeIcon
                    icon={faStar}
                    onClick={check}
                    size="2x"
                    color={"#E4C6F5"}
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    icon={FaStarRegular}
                    onClick={check}
                    size="2x"
                    color={"#E4C6F5"}
                  ></FontAwesomeIcon>
                )}
              </div>

              <Container>
                <b>✔️ 판매자</b> &nbsp;&nbsp;&nbsp; {itemObj.userName}
                <br></br>
                <b>✔️ 마감기한</b> &nbsp;&nbsp;&nbsp; {itemObj.deadline}
                <br></br>
                <b>✔️ 계좌</b> &nbsp;&nbsp;&nbsp;{itemObj.account}
                <br></br>
                <b>✔️ 상세사항</b>
                <DetailArea>{itemObj.etc}</DetailArea>
                <b>✔️ 주의사항</b>
                <DetailArea>{itemObj.notice}</DetailArea>
                <b>✔️ 상품</b>
                <EachDetail eachObj={eachObj} />
              </Container>
            </div>
            <div align="center">
              {itemObj.creatorId === userObj.uid ? (
                <>
                  <Btn1
                    onClick={onShowlistClick}
                  >
                    공구 참여자 목록 보기
                  </Btn1>
                  {itemObj.done?(
                    <DetailArea>이 공구는 마감되었습니다</DetailArea>
                  ):(
                    <Btn
                    onClick={onFinishClick}
                  >
                    공구 마감하기
                  </Btn>
                  )}
                  
                </>
              ) : (
                itemObj.deadline >= today  && (
                  <>
                    {itemObj.done?(
                    // itemObj.currentNum >= 300 ? (
                      <DetailArea>이 공구는 마감되었습니다</DetailArea>
                    ) : (
                      <Btn1
                        onClick={onJoinlistClick}
                      >
                        공구 참여하기
                      </Btn1>
                    )}
                  </>
                )
              )}
            </div>
            <br></br>
            <div className="detaillist_imo">
              <div className="detaillist_user">
                <span className="detaillist_user" onClick={onShareClick}>
                  <FontAwesomeIcon
                    size="2x"
                    color={"#C7D3F7"}
                    icon={faShareFromSquare}
                  />
                </span>
                {shareclick && <Kakao url={id} detailObj={itemObj} />}
                {itemObj.creatorId === userObj.uid && (
                  <>
                    {/* <span onClick={toggleEditing}>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        size="2x"
                        color={"#C7D3F7"}
                        title="수정"
                      />
                    </span> */}
                    <span className="detaillist_user" onClick={onDeleteClick}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="2x"
                        color={"#C7D3F7"}
                        title="삭제"
                      />
                    </span>
                  </>
                )}
              </div>
            </div>

            <hr></hr>
            <div>
              <div className="detaillist_qna">
                <h2> &nbsp; QnA</h2>
              </div>
              <>
                <div>
                  {!bucket ? (
                    <form onSubmit={QnAonSubmit}>
                      <input
                        className="qna_input"
                        type="text"
                        placeholder="🙏🏼수정은 불가능하세요.🙏🏼"
                        value={qna}
                        onChange={QnAonChange}
                      />
                      <button type="upload_Btn" className="upload_Btn">
                        💬
                      </button>
                    </form>
                  ) : (
                    <div className="qna_text">
                      🙏🏼 원활한 QnA를 위해 질문 하나만 가능합니다 🙏🏼
                    </div>
                  )}
                  <br></br>
                </div>
              </>
            </div>
            {qnas.map((qna) => (
              <QnA
                isOpener={detailObj.creatorId}
                key={qna.id}
                qnaObj={qna}
                isOwner={qna.creatorId === userObj.uid}
                userObj={userObj}
                detailObj={id}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="ini">
          <img
            id="rotating_img"
            width="80%"
            src="img/logo4.png"
            alt="로딩"
          ></img>
        </div>
      )}
    </>
  );
};
export default Detaillist;

const Container = styled.div`
  margin: 20px 8px 30px;
  padding: 7px 1px;
`;
const DetailArea = styled.div`
  background-color: #f9f9f9;
  border-radius: 7px;
  margin: 2px 4px 15px;
  padding: 3px 5px;
  white-space: pre-wrap;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 25px;
  text-align: center;
  margin: 0 0 10px;
`;
const Br = styled.div`
  margin: 10px 0 0;
`;
