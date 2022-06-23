import React from "react";
import { useLocation } from "react-router-dom";

const JoinDone = () => {
  const location = useLocation();
  const { link } = location.state;
  return (
    <div
      style={{
        width: "90%",
        height: "fit-content",
        padding: "20px",
        backgroundColor: " rgb(255, 255, 255)",
        borderRadius: "10px",
        marginTop: "120px",
      }}
    >
      폼 제출이 완료됐습니다.
      <br />
      제출 내용은 프로필 메뉴에서 확인 가능합니다.
      <br />
      <br />
      <hr />
      <span>
        ✔️ 공구 공지 오카방 바로가기&nbsp;{" "}
        <a href={link}>
          <img src="img/kakaotalk.png" height={20} width={20} />
        </a>
      </span>
    </div>
  );
};
export default JoinDone;
