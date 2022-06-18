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
      <h3>내가 연 공구</h3>
      <div>
        {startlist.map((list) => {
          if (list.creatorId === userObj.uid)
            return (
              <Mylist key={list.id} listObj={list} creatorId={list.creatorId} />
            );
        })}
      </div>

      <h3>내가 참여한 공구</h3>
      <div>
        {joinlist.map((list) => {
          console.log(list.creatorId, userObj.uid);
          if (list.creatorId === userObj.uid){
           
            return (
              <Myjoinlist key={list.id} listObj={list} isOwner={list.creatorId === userObj.uid}/>
            );
          }
          else{
            console.log("diff");
          }
        })}

      </div>

      <h3>스크랩 목록</h3>
      <div>
        {startlist.map((list) => (
          <Myscrap
            key={list.id}
            listObj={list}
            isOwner={list.creatorId === userObj.uid}
            userObj={userObj}
          />
        ))}
      </div>
      

      <h3>내가 문의한 공구</h3>
      {startlist.map((list) => (
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
};

export default Profile;
