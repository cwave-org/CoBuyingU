import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as FaStarRegular } from "@fortawesome/free-regular-svg-icons";
import { dbService } from "../fbase";

const CobuyingItem = ({ userObj, listObj, isOwner }) => {
  let navigate = useNavigate();
  let today = new Date();
  const [checked, setChecked] = useState(true);
  let checkObj;
  if (userObj != null) {
    checkObj = {
      check: !checked,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      userName: userObj.displayName,
    };
  } else {
    checkObj = {
      check: !checked,
      createdAt: Date.now(),
      creatorId: null,
      userName: null,
    };
  }

  let curday = new Date(listObj.deadline);
  curday.setHours(curday.getHours() + 14);
  curday.setMinutes(curday.getMinutes() + 59);
  curday.setSeconds(curday.getSeconds() + 59);

  useEffect(() => {
    dbService
      .doc(`startlist/${listObj.id}`)
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

  // 스크랩 기능
  const check = async (event) => {
    setChecked((current) => !current);
    if (checked) {
      // 스크랩
      await dbService
        .doc(`startlist/${listObj.id}/scrap/${userObj.uid}`)
        .set(checkObj);
      await dbService
        .doc(`startlist/${listObj.id}/scrap/${userObj.uid}`)
        .update({
          check: !check,
        });
      dbService
        .doc(`startlist/${listObj.id}/scrap/${userObj.uid}`)
        .get(checkObj);
    } else {
      // 스크랩 취소
      await dbService
        .doc(`startlist/${listObj.id}`)
        .collection("scrap")
        .doc(userObj.uid)
        .delete();
    }
  };

  const onDetaillistClick = () => {
    if (userObj != null) {
      navigate(`/selling/detail/${listObj.id}`, {
        replace: false,
        state: { detailObj: listObj },
      });
    } else {
      alert("접근 권한이 없습니다.");
    }
  };

  return (
    // className 뭐라 할까 css할때 헷갈릴까봐 아직 안바꿨어
    <div className="cobuyingItem">
      <>
        {today < curday ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justify: "center",
            }}
          >
            {userObj != null ? (
              <div className="home_scr">
                {!checked ? (
                  <FontAwesomeIcon
                    className="fa-globe"
                    icon={faStar}
                    onClick={check}
                    size="2x"
                    color={"#ffffff"}
                    aria-hidden="true"
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    className="fa-globe"
                    icon={FaStarRegular}
                    onClick={check}
                    size="2x"
                    color={"#ffffff"}
                  ></FontAwesomeIcon>
                )}
              </div>
            ) : (
              <></>
            )}
            <div onClick={onDetaillistClick}>
              {listObj.attachmentUrl ? (
                <img
                  style={{
                    width: "100%",
                    height: "85px",
                    marginBottom: 5,
                    borderRadius: 10,
                  }}
                  alt="썸네일"
                  src={listObj.attachmentUrl}
                />
              ) : (
                <>
                  <img
                    alt="썸네일"
                    style={{ width: "100%", height: "40%", marginBottom: 5 }}
                    src="img/transparent.png"
                  />
                </>
              )}
              <div className="name">
                {
                  <>
                    {listObj.itemname}
                    <br />
                    {/* 분류: {listObj.item} */}
                  </>
                }
              </div>
              <div className="deadline">{listObj.deadline}까지</div>
            </div>
          </div>
        ) : (
          <div
            className="endthing"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justify: "center",
            }}
          >
            <div onClick={onDetaillistClick}>
              {listObj.attachmentUrl ? (
                <img
                  style={{
                    width: "80%",
                    height: "80px",
                    marginBottom: 5,
                    borderRadius: 10,
                  }}
                  alt="썸네일"
                  src={listObj.attachmentUrl}
                />
              ) : (
                <>
                  <img
                    style={{ width: "100%", height: "40%", marginBottom: 5 }}
                    src="img/transparent.png"
                    alt="로딩"
                  />
                </>
              )}
              <div className="name">
                {
                  <>
                    {listObj.itemname}
                    <br />
                  </>
                }
              </div>
              <div className="deadline">{`${listObj.deadline}까지`}</div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};
export default CobuyingItem;
