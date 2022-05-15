import React, { useState } from "react";
import {useNavigate } from "react-router-dom";

const Item = ({ listObj, isBuyer}) => {
    const [newList, setNewList] = useState(listObj.text);

    let navigate = useNavigate();
    return (
        <div className="Itemclass">
            {isBuyer ? (<>
                <div>
                <h4>구매자 이름: {`${listObj.name}`}</h4>
                <br></br>
                </div>
                </>
            ): (<></>) }
        
        </div>
    );
};
export default Item;