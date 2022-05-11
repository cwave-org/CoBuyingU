import React, { useEffect, useState } from "react";
import Nweet from "../components/Nweet";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
    const [lists, setLists] = useState([]);
    useEffect(() => {
        dbService.collection("startlist").onSnapshot((snapshot) => {
            const listArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLists(listArray);
        });
    }, []);
    return (
        <div className="container">
            
            <div style={{ marginTop: 30 }}>
                {lists.map((list) => (
                    <Nweet
                        key={list.id}
                        listObj={list}
                        isOwner={list.creatorId === userObj.uid}
                    />
                ))}
            </div>

        </div>
    );
};
export default Home;