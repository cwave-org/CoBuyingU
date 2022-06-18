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
    useEffect(() => {
        dbService.collection("startlist").onSnapshot((snapshot) => {
            const listArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLists(listArray);
        });
    }, []);
    useEffect(() => {
        dbService.collection("joinlist").onSnapshot((snapshot) => {
            const listArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJoinlists(listArray);
        });
    }, []);
    return (
        <div className="container">
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