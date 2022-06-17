import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";

const Buydetaillist = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { detailObj } = location.state;

    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(detailObj.name);
    const [newPhonenumber, setNewPhonenumber] = useState(detailObj.phonenumber);
    const [newCount, setNewCount] = useState(detailObj.count);
    const [newSize, setNewSize] = useState(detailObj.size);
    const [newAddress, setNewAddress] = useState(detailObj.address);
    const [newAccount_name, setNewAccount_name] = useState(detailObj.account_name);
    const [newAccount_date, setNewAccount_date] = useState(detailObj.account_date);
    const [newAccount_re, setNewAccount_re] = useState(detailObj.account_re);

    const [newDetailObj, setNewDetailObj] = useState(detailObj);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await dbService.doc(`joinlist/${detailObj.id}`).delete();
        }
        navigate("/profile", {});
    }

    const toggleEditing = () => setEditing(prev => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`joinlist/${detailObj.id}`).update({
            name: newName,
            phonenumber: newPhonenumber,
            count: newCount,
            size: newSize,
            address: newAddress,
            account_date: newAccount_date,
            account_name: newAccount_name,
            account_re: newAccount_re,
        });
        setEditing(false);
    };

    const onChange = (event) => {
        if (event.target.id == "nameform") {
            const {
                target: { value },
            } = event;
            setNewName(value);
        }
        else if (event.target.id == "phonenumberform") {
            const {
                target: { value },
            } = event;
            setNewPhonenumber(value);
        }
        else if (event.target.id == "countform") {
            const {
                target: { value },
            } = event;
            setNewCount(value);
        }
        else if (event.target.id == "sizeform") {
            const {
                target: { value },
            } = event;
            setNewSize(value);
        }
        else if (event.target.id == "addressform") {
            const {
                target: { value },
            } = event;
            setNewAddress(value);
        }
        else if (event.target.id == "accountnameform") {
            const {
                target: { value },
            } = event;
            setNewAccount_name(value);
        }
        else if (event.target.id == "accountdateform") {
            const {
                target: { value },
            } = event;
            setNewAccount_date(value);
        }
        else if (event.target.id == "accountreform") {
            const {
                target: { value },
            } = event;
            setNewAccount_re(value);
        }
    };

    return (
        <>
            {editing ? (<>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <span>이름: </span>
                    <input
                        id="nameform"
                        type="text"
                        placeholder={newName}
                        onChange={onChange}
                        value={newName}
                    />
                    <br></br>
                    <span>전화번호: </span>
                    <input
                        id="phonenumberform"
                        type="tel"
                        placeholder={newPhonenumber}
                        onChange={onChange}
                        value={newPhonenumber}
                    />
                    <br></br>
                    <span>수량: </span>
                    <input
                        id="countform"
                        type="number"
                        placeholder={newCount}
                        onChange={onChange}
                        value={newCount}
                    />
                    <br></br>
                    <span>사이즈: </span>
                    <input
                        id="sizeform"
                        type="text"
                        placeholder={newSize}
                        onChange={onChange}
                        value={newSize}
                    />
                    <br></br>
                    <span>주소:</span>
                    <input
                        id="addressform"
                        type="text"
                        placeholder="배송을 원하시면 주소를 입력해주세요"
                        onChange={onChange}
                        value={newAddress}
                    />
                    <br></br>
                    <span>입금자명: </span>
                    <input
                        id="accountnameform"
                        type="text"
                        placeholder="입금자명을 입력해주세요"
                        onChange={onChange}
                        value={newAccount_name}
                    />
                    <br></br>
                    <span>입금일자: </span>
                    <input
                        id="accountdateform"
                        type="date"
                        placeholder="입금일자를 입력해주세요"
                        onChange={onChange}
                        value={newAccount_date}
                    />
                    <br></br>
                    <span>환불계좌(은행/계좌번호/입금주명): </span>
                    <input
                        id="accountreform"
                        type="text"
                        placeholder="환불계좌(은행/계좌번호/입금주명)을 입력해주세요"
                        onChange={onChange}
                        value={newAccount_re}
                    />
                    <input type="submit" value="Update Contents" className="formBtn" />
                </form>
                <button onClick={toggleEditing} className="cancelBtn">
                    Cancel
                </button>
            </>
            ) : (
                <>
                    <div>
                        <h3>이름 : {newDetailObj.name}</h3>
                        <h3>전화번호 : {newDetailObj.phonenumber}</h3>
                        <h3>수량 : {newDetailObj.count}</h3>
                        <h3>사이즈 : {newDetailObj.size}</h3>
                        <h3>주소 : {newDetailObj.address}</h3>
                        <h3>입금자명 : {newDetailObj.account_name}</h3>
                        <h3>입금일자 : {newDetailObj.account_date}</h3>
                        <h3>환불계좌 : {newDetailObj.account_re}</h3>
                    </div>
                    <div className="actions">
                        <button onClick={onDeleteClick}>TRASH</button>
                        <button onClick={toggleEditing}>EDIT</button>
                    </div>
                </>
            )}
        </>
    );
};
export default Buydetaillist;