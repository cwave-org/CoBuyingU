import React, { useEffect, useState } from "react";
import Nweet from "../components/Nweet";
import { dbService } from "../fbase";
import styled from 'styled-components';

const PostListWrapper = styled.div`
  display: grid;
  place-items: center;
  justify-content: space-evenly;
  font-size:: small;
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
        dbService.collection("startlist").onSnapshot((snapshot) => {
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

    // 파워 공구자
    useEffect(() => {
        const listdb = dbService.collection("startlist")
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
                })
            })
    }, [])

    // 파워 공구자 출력
    useEffect(() => {
        const startlistdb2 = dbService.collection("startlist")
            .get()
            .then((결과) => {
                결과.forEach((doc) => {
                    const creator = doc.data().creatorId;
                    const cur = map1.get(creator);
                    if (cur > powersellers) {
                        setPowerseller(doc.data().name); //이름
                        console.log(doc.data().name);
                        setPowersellers(cur); //  개수
                    }
                })
            })
    }, [])


    return (
        <div className="container">
            <div>
                <h3>파워공구자</h3>
                <h3>{powerseller}: {powersellers}</h3>
            </div>
            <PostListWrapper>
                {lists.map((list) => (
                    <Nweet
                        key={list.id}
                        userObj={userObj}
                        listObj={list}
                        isOwner={list.creatorId === userObj.uid}
                        {...list} />
                ))}

            </PostListWrapper>
            {/* <div style={{ marginTop: 30 }}> */}
            {/* {lists.map((list) => (
                    
                    <Nweet
                        key={list.id}
                        userObj={userObj}
                        listObj={list}
                        isOwner={list.creatorId === userObj.uid}
                    />
                ))} */}
            {/* </div> */}
        </div>
    );
};
export default Home;