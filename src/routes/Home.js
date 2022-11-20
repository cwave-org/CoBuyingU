import React, { useEffect, useState } from "react";
import CobuyingItem from "../components/CobuyingItem";
import { dbService } from "../fbase";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const PostListWrapper = styled.div`
  display: grid;
  place-items: center;
  justify-content: space-evenly;
  font-size: small;
  row-gap: 8x;
  grid-template-columns: repeat(2, auto);
`;

const Home = ({ userObj }) => {
  const [lists, setLists] = useState([]);
  const [joinlists, setJoinlists] = useState([]);

  const [powerseller, setPowerseller] = useState("");
  const [powersellers, setPowersellers] = useState(0);
  const map1 = new Map();

  // 모든 startlist 불러오기
  useEffect(() => {
    dbService
      .collection("startlist")
      .orderBy("deadline", "desc")
      .onSnapshot((snapshot) => {
        const listArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(listArray);
      });
  }, []);

  // 모든 joinlist 불러오기
  useEffect(() => {
    dbService.collection("joinlist").onSnapshot((snapshot) => {
      const listArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJoinlists(listArray);
    });
  }, []);

  var power_cnt = 0; // 최대 갯수
  var power_name = null;

  // 파워 공구자
  useEffect(() => {
    power_cnt = 0;
    const listdb = dbService
      .collection("startlist")
      .get()
      .then((결과) => {
        결과.forEach((doc) => {
          const creator = doc.data().creatorId;
          if (map1.get(creator) == undefined) {
            map1.set(creator, 1);
          }
          else { //있으면
            const creator = doc.data().creatorId;
            const index = map1.get(creator);
            map1.set(creator, index + 1);
          }

          if (map1.get(creator) > power_cnt) {
            power_cnt = map1.get(creator);
            power_name = doc.data().userName;
          }
        });

        setPowerseller(power_name);
        setPowersellers(power_cnt);
      });
  });


  return (
    <div className="container">
      {/* <div className="home_power">
        <p>
          👑 파워공구자 <span id="powerseller">{powerseller}</span>: {" "}
          {powersellers} 개 👑
        </p>
      </div> */}
      <div className="home_power">
        <a style={{textDecorationLine : "none", color:"#000000"}}
        href="https://instagram.com/cwave_?igshid=YmMyMTA2M2Y=">
            <span>공구대학교 사용법</span>
        </a>
      </div>
      <br></br>

      <PostListWrapper>
        {lists.map((list) => (
          <CobuyingItem
            key={list.id}
            userObj={userObj}
            listObj={list}
            isOwner={list.creatorId === userObj.uid}
            {...list}
          />
        ))}
      </PostListWrapper>
    </div>
  );
};
export default Home;
