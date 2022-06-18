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
  const [startlist, setStartlist] = useState([]);
  useEffect(() => {
    dbService.collection("startlist").onSnapshot((snapshot) => {
      const listArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStartlist(listArray);
    });
  }, []);
  

  // 모든 joinlist 불러오기
  const [joinlist, setJoinlist] = useState([]);
  useEffect(() => {
    dbService.collection("joinlist").onSnapshot((snapshot) => {
      const listArray2 = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJoinlist(listArray2);
    });
  }, []);

  return (
    <div className="container">
      <div className="myopen">
        <div className="my_title">💙진행 공구 목록💙</div>
        <hr/>
        <div className="myopen_context">
          {startlist.map((list) => {
            if (list.creatorId === userObj.uid)
              return (
                <Mylist key={list.id} listObj={list} creatorId={list.creatorId} />
              );
          })}
        </div>
      </div>
      <div className="myjoin">
        <div className="my_title">💙참여 공구 목록💙</div>
        <hr/>
        <div className="myjoin_context">
          {joinlist.map((list) => {
            if (list.creatorId === userObj.uid){
              return (
                <Myjoinlist key={list.id} listObj={list} isOwner={list.creatorId === userObj.uid}/>
              );
            }
          })}
        </div>
      </div>
      <div className="myjoin">
        <div className="my_title">💙스크랩💙</div>
        <hr/>
        <div className="myjoin_context">
          {startlist.map((list) => (
            <Myscrap
            key={list.id}
            listObj={list}
            isOwner={list.creatorId === userObj.uid}
            userObj={userObj}
          />
          ))}
        </div>
      </div>

      <div className="myjoin">
        <div className="my_title">💙문의한 공구💙</div>
        <hr/>
        <div className="myjoin_context">
        {startlist.map((list) => (
          <MyQnA
            key={list.id}
            listObj={list}
            isOwner={list.creatorId === userObj.uid}
            userObj={userObj}
          />
        ))}
        </div>
      </div>
     
    </div>
  );
};

export default Profile;
