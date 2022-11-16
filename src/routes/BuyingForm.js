import { render } from "@testing-library/react";
import React, { useEffect, useState, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dbService } from "../fbase";

const BuyingForm = ({ userObj }) => {
  const [name, setName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [count, setCount] = useState("");
  const [size, setSize] = useState("");
  const [address, setAddress] = useState("");
  const [account_name, setAccount_name] = useState("");
  const [account_date, setAccount_date] = useState("");
  const [account_re, setAccount_re] = useState("");
  const [items, setItems] = useState([]);
  const [isLodded, setIsLodded] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const { detailObj } = location.state; // 입력 폼 정보 받아오기

  useEffect(() => {
    dbService.doc(`itemlist/${detailObj.randomidx}`).onSnapshot((snapshot) => {
      for (let i = 0; i < snapshot.data().data.length; i++) {
        const item = {
          count: 0,
          ...snapshot.data().data[i],
        };
        console.log("i: " + i);
        console.log(item);
        setItems([[item], ...items]);
      }
      setIsLodded(1);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    const BuyingObj = {
      randomidx: detailObj.randomidx,
      name: name,
      phonenumber: phonenumber,
      count: count,
      size: size,
      address: address,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      account_date: account_date,
      account_name: account_name,
      account_re: account_re,
      deposit_complete: false,
      deleted: false,
    };

    await dbService.collection("joinlist").add(BuyingObj);
    setName("");
    setPhonenumber("");
    setCount("");
    setSize("");
    setAddress("");
    setAccount_name("");
    setAccount_date("");
    setAccount_re("");
    navigate("/buying/done", {
      replace: false,
      state: { link: detailObj.link },
    });
  };

  const onCancel = () => {
    navigate("/selling/detail", {
      replace: false,
      state: { detailObj: detailObj },
    });
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "nameform") {
      setName(value);
    } else if (event.target.id === "phonenumberform") {
      setPhonenumber(value);
    } else if (event.target.id === "countform") {
      setCount(value);
    } else if (event.target.id === "sizeform") {
      setSize(value);
    } else if (event.target.id === "addressform") {
      setAddress(value);
    } else if (event.target.id === "accountnameform") {
      setAccount_name(value);
    } else if (event.target.id === "accountdateform") {
      setAccount_date(value);
    } else if (event.target.id === "accountreform") {
      setAccount_re(value);
    }
  };

  const add = (event, item, i) => {
    event.preventDefault();
    console.log(items);
    setItems([
      ...items.slice(0, i),
      {
        ...items[i],
        count: items[i].count + 1,
      },
      ...items.slice(i + 1, items.length),
    ]);
  };

  const minus = (event, item, i) => {
    event.preventDefault();
    setItems([
      ...items.slice(0, i),
      {
        ...items[i],
        count: items[i].count - 1,
      },
      ...items.slice(i + 1, items.length),
    ]);
  };

  return (
    <form className="openjoin_container" onSubmit={onSubmit}>
      <p>공구 참여하기</p>
      <p>✔️ 입금자 명 </p>
      <p className="openjoin_que">
        <input
          className="openjoin_input"
          id="accountnameform"
          type="text"
          placeholder="입금자명을 입력해주세요"
          onChange={onChange}
          value={account_name}
          required
        />
      </p>
      <p>✔️ 전화번호 </p>
      <p className="openjoin_que">
        <input
          className="openjoin_input"
          id="phonenumberform"
          type="tel"
          placeholder="Write phone number"
          onChange={onChange}
          value={phonenumber}
          required
        />
      </p>
      <p>✔️ 입금 날짜 : 시간 : 분 </p>
      <p className="openjoin_que">
        <input
          className="openjoin_input"
          id="accountdateform"
          type="datetime-local"
          onChange={onChange}
          value={account_date}
          required
        />
      </p>
      <p>✔️ 배송여부</p>
      <input type="radio" name="theme" value="site" />
      현장배부
      <input type="radio" name="theme" value="parcel" />
      택배배송
      <p>✔️ 헌장배부 날짜 </p>
      <p className="openjoin_que">
        <input
          className="openjoin_input"
          id="accountdateform"
          type="date"
          onChange={onChange}
          value={account_date}
          required
        />
      </p>
      <p>✔️ 집주소 </p>
      <p className="openjoin_que">
        <input
          className="openjoin_input"
          id="addressform"
          type="text"
          placeholder="상세주소를 입력하세요"
          onChange={onChange}
          value={address}
        />
      </p>
      <p>✔️ 환불계좌(은행/계좌번호/입금주명)</p>
      <p className="openjoin_que">
        <input
          className="openjoin_input"
          id="accountreform"
          type="text"
          placeholder="환불계좌(은행/계좌번호/입금주명)을 입력해주세요"
          onChange={onChange}
          value={account_re}
          required
        />
      </p>
      <p className="openjoin_que">
        <span>✔️ 수량: </span>
        <input
          className="openjoin_input"
          id="countform"
          type="number"
          placeholder="수량을 입력하세요"
          onChange={onChange}
          value={count}
          required
        />
      </p>
      {isLodded == 1 ? (
        <table>
          <thead>
            <tr>
              <th>상품명</th>
              <th>가격</th>
              <th>수량</th>
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.itemname}</td>
                  <td>{item.price}</td>
                  <td>{item.count}</td>
                  <td>
                    <button onClick={(event) => add(event, item, i)}>+</button>
                  </td>
                  <td>
                    <button onClick={(event) => minus(event, item, i)}>
                      -
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <></>
      )}
      <p className="openjoin_que">
        <span>✔️ 사이즈: </span>
        <input
          className="openjoin_input"
          id="sizeform"
          type="text"
          placeholder="사이즈를 입력하세요"
          onChange={onChange}
          value={size}
          required
        />
      </p>
      <div>
        <button className="default_Btn_Right" onClick={onCancel}>
          취소
        </button>
        <button className="default_Btn_Right" type="submit">
          제출
        </button>
      </div>
    </form>
  );
};

export default BuyingForm;
