import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
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
  useEffect(async () => {
    dbService.collection("startlist").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        if (doc.id == itemId) {
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
    navigate("/itemlist", { replace: false, state: { detailObj: detailObj } });
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
      .collection("QnA")
      .onSnapshot((snapshot) => {
        setBucket(false);
        setQnas([]);
        snapshot.docs.map((doc) => {
          // 이미 문의댓글을 달은 경우
          if (doc.id == userObj.uid) {
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
  /*
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
  };*/

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
          if (doc.id == userObj.uid) {
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
          <form onSubmit={onSubmit}>
            <p>
              이름 :
              <input
                value={name}
                onChange={onChange_name}
                type="text"
                placeholder={itemObj.name}
                maxLength={120}
              />
            </p>

            <p>
              상품이름 :
              <input
                value={itemname}
                onChange={onChange_itemname}
                type="text"
                placeholder={itemObj.itemname}
                maxLength={120}
              />
            </p>

            <p>
              품목:
              <input
                value={item}
                onChange={onChange_item}
                type="text"
                placeholder={itemObj.item}
                maxLength={120}
              />
            </p>

            <p>
              가격(원) :
              <input
                value={price}
                onChange={onChange_price}
                type="number"
                placeholder={itemObj.price}
                maxLength={120}
              />
            </p>

            <p>
              마감기한 :
              <input
                value={deadline}
                onChange={onChange_deadline}
                type="date"
                placeholder={itemObj.deadline}
                maxLength={120}
              />
            </p>

            <p>
              기타사항 :
              <input
                value={etc}
                onChange={onChange_etc}
                type="text"
                placeholder={itemObj.etc}
                maxLength={120}
              />
            </p>

            <p>
              계좌(은행/ 계좌번호/입금주명) :
              <input
                value={account}
                onChange={onChange_account}
                type="text"
                placeholder={itemObj.account}
                maxLength={120}
              />
            </p>

            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="수정하기" onSubmit={onSubmit} />
            {attachment && (
              <div>
                <img src={attachment} width="50px" height="50px" />
                <button onClick={onClearAttachment}>Clear</button>
              </div>
            )}
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <div className="dataillist content">
            <div>
              <h3>공구 명 : {itemObj.name}</h3>
              <h3>상품 명 : {itemObj.itemname}</h3>
              <h3>가격 : {itemObj.price}</h3>
              <h3>마감기한 : {itemObj.deadline}</h3>
              <h3>기타사항 : {itemObj.etc}</h3>
              <h3>계좌 : {itemObj.account}</h3>
            </div>
            <div>
              <button
                className="detaillist submit Btn"
                onClick={onJoinlistClick}
              >
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
              <p>♥무엇이든지 물어보세요♥</p>
              <>
                <div>
                  {!bucket ? (
                    <form onSubmit={QnAonSubmit}>
                      <input
                        type="text"
                        placeholder="🙏🏼수정은 불가능하세요.🙏🏼"
                        value={qna}
                        onChange={QnAonChange}
                      />

                      <button type="submit">Upload</button>
                    </form>
                  ) : (
                    <div>"🙏🏼원활한 QnA를 위해 인당 1 질문만 할수🙏🏼"</div>
                  )}
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
          </div>
          <div>
            {userObj && (
              <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default Detaillist;
