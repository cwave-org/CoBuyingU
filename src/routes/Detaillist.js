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


const Detaillist = ({ userObj }) => {
  const [shareclick,setShareClick]=useState(false);
  const location = useLocation();
  let { detailObj } = location.state;
  const itemId = detailObj.id;
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(true);
  const [qna, setQna] = useState("");
  const [qnas, setQnas] = useState([]);
  const [itemObj, setItemObj] = useState(detailObj);
  const navigate = useNavigate();
  const [bucket, setBucket] = useState(false);
  const [name, setName] = useState(itemObj.name);
  const [itemname, setItemname] = useState(itemObj.itemname);
  const [item, setItem] = useState(itemObj.item);
  const [price, setPrice] = useState(itemObj.price);
  const [deadline, setDeadline] = useState(itemObj.deadline);
  const [etc, setEtc] = useState(itemObj.etc);
  const [account, setAccount] = useState(itemObj.account);
  const [link, setLink] = useState("");
  const [attachment, setAttachment] = useState(itemObj.attachmentUrl);
  const[newattachment,setNewAttachment]=useState("");
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
        }
      });
    });

  }, []);

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
    /*if (ok) {

      navigate("/");
      await dbService.doc(`startlist/${detailObj.id}`).delete();
      // await storageService.refFromURL(itemObj.attachmentUrl).delete();
    }*/
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

      
      //await dbService.doc(`startlist/${detailObj.id}`).delete();
      deleteCollection(dbService, `startlist/${detailObj.id}/QnA/${qnaObj.id}/comments`)
      await dbService
        .doc(`startlist/${detailObj.id}`)
        .collection("QnA")
        .doc(`${qnaObj.id}`)
        .delete();
     deleteCollection2(dbService, `startlist/${detailObj.id}/QnA`)
      await dbService
        .doc(`startlist/${detailObj.id}`)
        .delete();
      deleteCollection2(dbService, `startlist/${detailObj.id}/acrap`)
      await dbService
        .doc(`startlist/${detailObj.id}`)
        .delete();
    }
    //await storageService.refFromURL(itemObj.attachmentUrl).delete();
  };

  // Edit Cobuying Item
  const toggleEditing = () => setEditing((prev) => !prev);

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
      })
    }
    await dbService.doc(`startlist/${itemId}`).update({
      name: name,
      itemname: itemname,
      item: item,
      price: price,
      deadline: deadline,
      account: account,
      etc: etc,
    });
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "name") {
      setName(value);
    } else if (event.target.id === "itemname") {
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
      setNewAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);

  const qnaObj = {
    text: qna,
    createdAt: Date.now(),
    creatorId: userObj.uid,
    userName: userObj.displayName,
  };

  // 댓글
  useEffect(() => {
    dbService
      .doc(`startlist/${detailObj.id}`)
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
      .doc(detailObj.id)
      .collection("QnA")
      .doc(userObj.uid)
      .set(qnaObj);

    dbService
      .collection("startlist")
      .doc(detailObj.id)
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
      .doc(`startlist/${detailObj.id}`)
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
    } else {
      // 스크랩 취소
      await dbService
        .doc(`startlist/${detailObj.id}`)
        .collection("scrap")
        .doc(userObj.uid)
        .delete();
    }
  };
  const onShareClick=()=>{
    setShareClick(true);
  }
  return (
    <>
      {editing ? (
        <>
          <form className="openjoin_container" onSubmit={onSubmit}>
            <p className="openjoin_que">
              <span>✔️ 이름: </span>
              <input
                id="name"
                className="openjoin_input"
                value={name}
                onChange={onChange}
                type="text"
                placeholder={itemObj.name}
                maxLength={120}
                required
              />
            </p>

            <p className="openjoin_que">
              <span>✔️ 상품이름: </span>
              <input
                id="itemname"
                className="openjoin_input"
                value={itemname}
                onChange={onChange}
                type="text"
                placeholder={itemObj.itemname}
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
                placeholder={itemObj.item}
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
                placeholder={itemObj.price}
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
              <span className="openjoin_long">✔️ 오픈채팅방 링크 : </span>
              <input
                id="link"
                className="openjoin_input"
                value={link}
                onChange={onChange}
                type="text"
                placeholder={itemObj.link}
                maxLength={150}
                style={{ marginBottom: 5 }}
              />
            </p>
            <p className="openjoin_que">
              <span className="openjoin_long">
                ✔️ 계좌(은행/ 계좌번호/입금주명) :{" "}
              </span>
              <input
                id="account"
                className="openjoin_input"
                value={account}
                onChange={onChange}
                type="text"
                placeholder={itemObj.account}
                maxLength={120}
                style={{ marginBottom: 5 }}
                required
              />
            </p>
            <p className="openjoin_que">
              <span className="openjoin_long">✔️ 사진 : </span>
              <input
                className="openjoin_input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
              {attachment && (
                <div className="attatchment">
                  <img src={attachment} />
                  <button onClick={onClearAttachment}>Clear</button>
                </div>
              )}
            </p>
            <p className="openjoin_que">
              <span className="openjoin_long">✔️ 기타사항 : </span>
              <input
                id="etc"
                className="openjoin_input"
                value={etc}
                onChange={onChange}
                type="text"
                placeholder={itemObj.etc}
                maxLength={120}
              />
              <br />
              <br />
              <div>
                <button
                  className="default_Btn_Right"
                  onClick={toggleEditing}
                  style={{ margin: "1%" }}
                >
                  취소
                </button>
                <button
                  className="default_Btn_Right"
                  type="submit"
                  style={{ margin: "1%" }}
                >
                  제출
                </button>
              </div>
            </p>
          </form>
        </>
      ) : (
        <>
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
                  <b>판매자</b> &nbsp;&nbsp;&nbsp; {itemObj.name}
                  <br></br>
                  <b>마감기한</b> &nbsp;&nbsp;&nbsp; {itemObj.deadline}
                  <br></br>
                  <b>계좌</b> &nbsp;&nbsp;&nbsp;{itemObj.account}
                  <br></br>
                  <b>오픈채팅방</b>
                  <span className="detaillist_bar">
                    {detailObj.link ? (
                      <a href={detailObj.link}>
                        <img src="img/kakaotalk.png" height={20} width={20} />
                      </a>
                    ) : (
                      <img
                        src="img/kakao_no.png"
                        height={20}
                        width={20}
                        title="연결된 오픈채팅방이 없습니다."
                      />
                    )}
                  </span>
                  <br></br>
                  <b>기타사항</b> <br></br>
                  {itemObj.etc}
                  <br></br>
                </p>
              </div>
            </div>

            <div align="center">
              {detailObj.creatorId === userObj.uid ? (
                <button
                  className="default_Btn_Center"
                  onClick={onShowlistClick}
                >
                  공구 참여자 목록 보기
                </button>
              ) : (
                <button
                  className="default_Btn_Center"
                  onClick={onJoinlistClick}
                >
                  공구 참여하기
                </button>
              )}
            </div>
            <br></br>
            <div className="detaillist_imo">
            <div className="detaillist_user">
                <span onClick={onShareClick} style={{float:"inlineEnd"}}>
                <FontAwesomeIcon 
                  size="2x"
                  color={"#C7D3F7"}
                  icon={faShareFromSquare}
                   />
                </span>
                {
                  shareclick&&(
                  <Kakao detailObj={detailObj}/>)
                }
                {detailObj.creatorId === userObj.uid && (
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
                        Upload
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
                  detailObj={detailObj}
                />
              ))}
            </>
          </div>
        </>
      )}
    </>
  );
};
export default Detaillist;
