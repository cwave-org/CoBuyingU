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
import QnA from "../components/QnA";
import { useParams } from "react-router-dom";

const Detaillist = ({ userObj }) => {
  const { id } = useParams();
  const [isLodded, setIsLodded] = useState(false);
  const [shareclick, setShareClick] = useState(false);
  const [detailObj, setDetailObj] = useState([]);
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
      });
  }, []);

  const itemId = id;
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(true);
  const [qna, setQna] = useState("");
  const [qnas, setQnas] = useState([]);

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
  const [itemObj, setItemObj] = useState(detailObj);
  const navigate = useNavigate();
  const toggleEditing = () => {
    navigate("/selling/edit", {
      replace: false,
      state: { itemObj: itemObj, itemId: id },
    });
  };
  const [bucket, setBucket] = useState(false);

  const onJoinlistClick = () => {
    navigate("/buying", { replace: false, state: { detailObj: detailObj } });
  };
  const onShowlistClick = () => {
    navigate("/itemlist", {
      replace: false,
      state: { buyerindex: detailObj.randomidx, filename: detailObj.itemname },
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
        <div className="detaillist_content">
          <div>
            <h2 align="center">{itemObj.itemname}</h2>

            {itemObj.attachmentUrl && (
              <img src={itemObj.attachmentUrl} className="detaillist_img" />
            )}
            <h3 align="center"> {itemObj.price}원</h3>

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

            <div className="detaillist_font">
              <p>
                <b>✔️ 판매자</b> &nbsp;&nbsp;&nbsp; {itemObj.userName}
                <br></br>
                <b>✔️ 마감기한</b> &nbsp;&nbsp;&nbsp; {itemObj.deadline}
                <br></br>
                <b>✔️ 계좌</b> &nbsp;&nbsp;&nbsp;{itemObj.account}
                <br></br>
                <b>✔️ 기타사항</b> <br></br>
                <div
                  className="need_enter"
                  style={{ paddingLeft: "3%", paddingRight: "3%" }}
                >
                  <br></br> {itemObj.etc}
                </div>
                <br></br>
              </p>
            </div>
          </div>

          <div align="center">
            {itemObj.creatorId === userObj.uid ? (
              <>
                <button
                  className="default_Btn_Center"
                  onClick={onShowlistClick}
                >
                  공구 참여자 목록 보기
                </button>
              </>
            ) : (
              <button className="default_Btn_Center" onClick={onJoinlistClick}>
                공구 참여하기
              </button>
            )}
          </div>
          <br></br>
          <div className="detaillist_imo">
            <div className="detaillist_user">
              <span onClick={onShareClick} style={{ float: "inlineEnd" }}>
                <FontAwesomeIcon
                  size="2x"
                  color={"#C7D3F7"}
                  icon={faShareFromSquare}
                />
              </span>
              {shareclick && <Kakao url={id} detailObj={itemObj} />}
              {itemObj.creatorId === userObj.uid && (
                <>
                  <span onClick={toggleEditing}>
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      size="2x"
                      color={"#C7D3F7"}
                      title="수정"
                    />
                  </span>
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
          <>
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
          </>
        </div>
      ) : (
        <div className="ini">
          <img id="rotating_img" width="80%" src="img/logo4.png"></img>
        </div>
      )}
    </>
  );
};
export default Detaillist;
