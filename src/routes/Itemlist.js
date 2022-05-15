import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import Item from "../components/Item";
import Excel from "../components/Excel";

const Itemlist = ({ buyinglist}) => {
   
    //전체 구매자 리스트 불러오기
    const [lists, setLists] = useState([[]]);
    // const isBuyer="";
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
    const location = useLocation();
    const { detailObj } = location.state;

    return (
            <div className="itemlistclass">
                <h3>전체 리스트 불러오기</h3>
                {lists.map((list) => (
                    <Item
                        key={list.id}
                        listObj={list}
                        isBuyer={list.randomidx===detailObj.randomidx} 
                
                    />
                ))}
                <Excel exceldata={lists} name={detailObj.itemname}/>
                {/* 여기서 lists가 걍 전체 joinlist를 의미하는거라 .. 어케 구현할지 고민중 걍 field에 isbuyer항목 추가해서
                그게 tf 따라서 다시 스냅샷해서 excel.js에서 다루는게 편할거같은디 흠 */}
            </div>           
    )
};
export default Itemlist;