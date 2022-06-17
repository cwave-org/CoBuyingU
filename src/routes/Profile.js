import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../fbase";
import Mylist from "../components/Mylist";

import Myscrap from "../components/Myscrap";

import Myjoinlist from "../components/Myjoinlist";
import MyQnA from "../components/MyQnA";


const Profile = ({ refreshUser, userObj, listObj}) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    };

    // 모든 startlist 불러오기
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
/*
    const [scraps, setScraps] = useState([]);
    useEffect(() => {
        dbService.doc(`startlist/${detailObj.id}`).collection("scrap").onSnapshot((snapshot) => {
            const listArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setScraps(listArray);
        });
    }, []);*/

    // 모든 scrap불러오기
    const [lists3, setLists3] = useState([]);
    useEffect(() => {
        dbService.doc(`startlist/${listObj}`).collection("QnA").onSnapshot((snapshot) => {
            const listArray3 = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                
            }));
            setLists3(listArray3);
        });
    }, []);

    // 모든 joinlist 불러오기
    const [lists2, setLists2] = useState([]);
    useEffect(() => {
        dbService.collection("joinlist").onSnapshot((snapshot) => {
            const listArray2 = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLists2(listArray2);
        });
    }, []);


    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange}
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    autoFocus
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <h3>
                내가 연 공구
            </h3>
            <div>
                {lists.map((list) => (
                    
                    <Mylist
                        key={list.id}
                        listObj={list}
                        isOwner={list.creatorId === userObj.uid}
                        creatorId={list.creatorId}
                        
                    />
                ))}
            </div>

            <h3>
                스크랩 목록
                
            </h3>
            <div>
                {lists.map((list) => (
                    <Myscrap
                    key={list.id}
                        listObj={list}
                        isOwner={list.creatorId === userObj.uid}
                        userObj={userObj}
                    />
                    
                ))}
                               
            </div>
            <h3>
                내가 참여한 공구
            </h3>
            <div>
                {lists2.map((list2) => (
                    <Myjoinlist
                        key={list2.id}
                        listObj={list2}
                        isOwner={list2.creatorId === userObj.uid}
                    />
                ))}
            </div>

            <h3>
                내가 문의한 공구
            </h3>
            {lists.map((list) => (
                    <MyQnA
                        key={list.id}
                        listObj={list}
                        isOwner={list.creatorId === userObj.uid}
                        userObj={userObj}
                    />
                    
                ))}
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
}

export default Profile;