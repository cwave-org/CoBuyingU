import React, { useEffect, useState } from "react";
import styled from "styled-components";

const EachBox=styled.div`
  background-color: #F6F6F6;
  margin: 5px 7px 10px;
  border: 2px solid  #F6F6F6;
  border-radius: 10px;
  padding:5px;
  /* border-bottom: ; */
`;

const EachDetail=styled.div`
  margin-bottom: 10px;
`;

const DateItem = (props) => {
  const [handout_date, setHandout_date] = useState("");

  useEffect(() => {
    props.setData([
      {
        id: props.id,
        handout_date: handout_date,
        count:0
      },
      ...props.data,
    ]);
  }, [handout_date, props]);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    if (event.target.id === "handoutdateform") {
      setHandout_date(value);
    }
  };

  return (
    <>
    <EachBox>
      {/* <EachTitle>{props.id}번 날짜 및 시작 시간</EachTitle> */}
      <EachDetail>
          <input
            className="openjoin_input"
            id="handoutdateform"
            type="datetime-local"
            onChange={onChange}
            value={handout_date}
            required
          />
        </EachDetail>
    </EachBox>
    </>
  );
};

export default DateItem;
