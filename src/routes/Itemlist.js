import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import Item from "../components/Item";

const Itemlist = ({ buyinglist }) => {

    //전체 판매자 리스트 불러오기
    const [lists, setLists] = useState([]);

    useEffect(() => {
        dbService.collection("joinlist").onSnapshot((snapshot) => {
            const listArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLists(listArray);
        });
    }, []);
    
    // 구매 항목 관련 정보 불러오기
    let navigate = useNavigate();
    const location = useLocation();
    const { detailObj } = location.state;

    return (
        <>
            <div className="itemlistclass">
                <h3>전체 리스트 불러오기</h3>
                {lists.map((list) => (
                    <Item
                        key={list.id}
                        listObj={list}
                        isBuyer={list.randomidx === detailObj.randomidx}
                    />
                ))}
            </div>           
        </>
    )
};
export default Itemlist;
