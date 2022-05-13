import React, { useEffect, useState } from "react";
import Nweet from "../components/Nweet";
import { dbService, storageService } from "../fbase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import SellingForm from "./SellingForm";

const Home = ({ userObj }) => {
    const [lists, setLists] = useState([]);
    const navigate=useNavigate();
    const onStartlistClick=()=>{
        navigate("/selling");
    }
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
            <button className="startlist Btn" onClick={onStartlistClick}>
                공구 열기
            </button>
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