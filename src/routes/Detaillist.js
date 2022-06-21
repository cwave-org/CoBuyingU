import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as FaStarRegular } from "@fortawesome/free-regular-svg-icons";

import QnA from "../components/QnA";

const Detaillist = ({ userObj }) => {
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
    if (ok) {
      navigate("/");
      await dbService.doc(`startlist/${detailObj.id}`).delete();
      // await storageService.refFromURL(itemObj.attachmentUrl).delete();
    }
  };

  // Edit Cobuying Item
  const [name, setName] = useState(itemObj.name);
  const [itemname, setItemname] = useState(itemObj.itemname);
  const [item, setItem] = useState(itemObj.item);
  const [price, setPrice] = useState(itemObj.price);
  const [deadline, setDeadline] = useState(itemObj.deadline);
  const [etc, setEtc] = useState(itemObj.etc);
  const [account, setAccount] = useState(itemObj.account);
  const [link, setLink] = useState("");
  const [attachment, setAttachment] = useState(itemObj.attachmentUrl);
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`startlist/${itemId}`).update({
      name: name,
      itemname: itemname,
      item: item,
      price: price,
      deadline: deadline,
      account: account,
      etc: etc,
      attachmentUrl: attachment,
    });
    setEditing(false);
  };
  const onChange_link = (event) => {
    const {
      target: { value },
    } = event;
    setLink(value);
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
      .collection("QnA").orderBy('createdAt')
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

  return (
    <>
      {editing ? (
          <>
            <form className="openjoin_container" onSubmit={onSubmit} >
              <p className="openjoin_que">
                <span>✔️ 이름: </span>
                <input
                  className="openjoin_input"
                  value={name}
                  onChange={onChange_name}
                  type="text"
                  placeholder={itemObj.name}
                  maxLength={120}
                  required
                />
              </p>

              <p className="openjoin_que">
                <span>✔️ 상품이름: </span>
                <input
                  className="openjoin_input"
                  value={itemname}
                  onChange={onChange_itemname}
                  type="text"
                  placeholder={itemObj.itemname}
                  maxLength={120}
                  required
                />
              </p>

              <p className="openjoin_que">
                <span>✔️ 품목: </span>
                <input
                  className="openjoin_input"
                  value={item}
                  onChange={onChange_item}
                  type="text"
                  placeholder={itemObj.item}
                  maxLength={120}
                  required
                />
              </p>

              <p className="openjoin_que">
                <span>✔️ 가격(원): </span>
                <input
                  className="openjoin_input"
                  value={price}
                  onChange={onChange_price}
                  type="number"
                  placeholder={itemObj.price}
                  maxLength={120}
                  required
                />
              </p>
              <p className="openjoin_que">
                <span>✔️ 마감기한: </span>
                <input
                  className="openjoin_input"
                  value={deadline}
                  onChange={onChange_deadline}
                  type="date"
                  placeholder="마감기한"
                  maxLength={120}
                  required
                />
              </p>

              <p className="openjoin_que">
                <span className="openjoin_long">✔️ 오픈채팅방 링크 : </span>
                <input
                  className="openjoin_input"
                  value={link}
                  onChange={onChange_link}
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
                  className="openjoin_input"
                  value={account}
                  onChange={onChange_account}
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
                  placeholder={itemObj.etc}
                  maxLength={120}
                />
                <br/><br/>
                <input type="submit" value="취소" onSubmit={toggleEditing} style={{margin:'1%'}}/>
                <input type="submit" value="수정" onSubmit={onSubmit} style={{margin:'1%'}}/>
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
                  <b>기타사항</b> <br></br> {itemObj.etc}
                </p>
              </div>
            </div>

            <div align="center">
              <button className="submit_Btn" onClick={onJoinlistClick}>
                공구 참여하기
              </button>
              {detailObj.creatorId === userObj.uid && (<button className="submit_Btn" onClick={onShowlistClick}>
                공구 참여자 목록 보기
              </button>)}

            </div>
            <br></br>
            <div className="detaillist_imo">
              <div>
                {detailObj.creatorId === userObj.uid && (
                  <div className="detaillist_user">
                    <span onClick={toggleEditing}>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        size="2x"
                        color={"#4B59A8"}
                        title="수정"
                      />
                    </span>
                    <span className="detaillist_user" onClick={onDeleteClick}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="2x"
                        color={"#4B59A8"}
                        title="삭제"
                      />
                    </span>
                  </div>
                )}
                <span className="detaillist_bar">
                  {detailObj.link ? 
                  <a href={detailObj.link}>
                    <img src="img/kakaotalk.png" height={30} width={30} />
                  </a> : 
                    <img src="img/kakao_no.png" height={30} width={30} title="연결된 오픈채팅방이 없습니다."/>
                 }
                </span>
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
                      <button type="upload_Btn">Upload</button>
                    </form>
                  ) : (
                    <div className="qna_text">🙏🏼 원활한 QnA를 위해 질문 하나만 가능합니다 🙏🏼</div>
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
