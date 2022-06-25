import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import Mylist from "../components/Mylist";
import Myscrap from "../components/Myscrap";
import Myjoinlist from "../components/Myjoinlist";
import MyQnA from "../components/MyQnA";

const Profile = ({ userObj, listObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

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

  //이름 바꾸기
  const onChange = async (event) => {
    //event.preventDefault();
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    // dbService.doc(`user/${userObj.uid}`).get(userObj);
    if (userObj.displayName !== newDisplayName) {
      const IDcheck = await dbService
        .collection("user")
        .where("displayName", "==", newDisplayName)
        .get();
      if (IDcheck.docs.length == 0 && newDisplayName.length > 0) {
        //user에 업로드
    await dbService.doc(`user/${userObj.uid}`).set({
      displayName: userObj.displayName,
      uid: userObj.uid,
    });
        await userObj.updateProfile({
          displayName: newDisplayName,
        });
        refreshUser();
        await dbService.doc(`user/${userObj.uid}`).update({
          displayName: newDisplayName,
        });
        alert("닉네임 변경완료!");
      }
      else{
        if (newDisplayName.length != 0)
        alert("중복된 닉네임입니다.");
      }
    }
    else {
        alert("같은 닉네임입니다.");
    }

  };

  return (
    <div className="container">
      <div className="profile_edit">
        <form onSubmit={onSubmit}>
          <div>
            <input
              className="profile_text"
              onChange={onChange}
              type="text"
              autoFocus
              placeholder="닉네임"
              value={newDisplayName}
            /> &nbsp;
            <button>
              Change Your ID
            </button>
          </div>
        </form>
      </div>
      <br></br>

      <div className="myopen">
        <div className="my_title">💙진행 공구 목록💙</div>
        <hr />
        <div className="myopen_context">
          {startlist.map((list) => {
            if (list.creatorId === userObj.uid)
              return (
                <Mylist
                  key={list.id}
                  listObj={list}
                  creatorId={list.creatorId}
                />
              );
          })}
        </div>
      </div>
      <div className="myjoin">
        <div className="my_title">💙참여 공구 목록💙</div>
        <hr />
        <div className="myjoin_context">
          {joinlist.map((list) => {
            if (list.creatorId === userObj.uid) {
              return (
                <Myjoinlist
                  key={list.id}
                  listObj={list}
                  isOwner={list.creatorId === userObj.uid}
                  userObj={userObj}
                />
              );
            }
          })}
        </div>
      </div>
      <div className="myjoin">
        <div className="my_title">💙스크랩💙</div>
        <hr />
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
        <hr />
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
