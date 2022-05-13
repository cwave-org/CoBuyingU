import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, Route, Router, Routes, useNavigate } from "react-router-dom";
import Detaillist from "../routes/Detaillist";
import { Navigate } from "react-router-dom";
const Nweet = ({ listObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newList, setNewList] = useState(listObj.text);
  let navigate=useNavigate();
  const onDetaillistClick=()=>{   
    const detailObj="dd";
    navigate("/selling/detail", {replace: false, state:{detailObj : listObj} });
          
         
  }
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`startlist/${listObj.id}`).delete();
      await storageService.refFromURL(listObj.attachmentUrl).delete();
    }
  }
  const toggleEditing = () => setEditing(prev => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`startlist/${listObj.id}`).update({
      text: newList,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewList(value);
  };
  return (
    // className 뭐라 할까 css할때 헷갈릴까봐 아직 안바꿨어
    <div className="nweet">
      {
        editing ? (
          <>
            <form onSubmit={onSubmit} className="container nweetEdit">
              <input
                type="text"
                placeholder="Edit your nweet"
                value={newList}
                required
                autoFocus
                onChange={onChange}
                className="formInput"
              />
              <input type="submit" value="Update Nweet" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
              Cancel
            </span>
          </>
        ) : (
          <>
            <div>
              <h4>{`${listObj.item}공구☞ ${listObj.itemname}`}</h4>
              <h4>{`${listObj.deadline}까지`}</h4>
              <button className="detaillist Btn" onClick={onDetaillistClick}>
                자세히 보기
                
            </button>
              <br></br>
              {listObj.attachmentUrl && <img src={listObj.attachmentUrl} />}
              {isOwner && (
                <div className="nweet__actions">
                  <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                  <span onClick={toggleEditing}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
            </div>
            )}
            </div>
          </>
        )
      }

    </div>
  );
};
export default Nweet;