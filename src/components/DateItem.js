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
        handout_date: handout_date
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
      <EachDetail>
          <input
            className="openjoin_input"
            id="handoutdateform"
            onChange={onChange}
            value={handout_date}
            placeholder="2023년 1월 6일 15시~20시"
            required
          />
        </EachDetail>
    </EachBox>
    </>
  );
};

export default DateItem;