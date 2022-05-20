import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import Item from "../components/Item";
import Excel from "../components/Excel";

const Itemlist = () => {
    const location = useLocation();
    const { buyerindex, filename } = location.state;
    const [lists, setLists] = useState([]);
    useEffect(() => {
        dbService.collection("joinlist")
        .where("randomidx","==",buyerindex).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                const myobj={
                    ...doc.data(),
                    id: doc.id,
                }
                setLists(prev=>[myobj,...prev]);
            })
        })
    }, [buyerindex]);
    return (
        <div className="itemlistclass">
            <h3>전체 리스트</h3>
            <Excel exceldata={lists} name={filename}/>
            <br></br>
            {lists.map((list) => (
                <Item
                    key={list.id}
                    listObj={list}
                    isBuyer={list.randomidx===buyerindex} 
                />
            ))}
            </div>      
    )
};
export default Itemlist;