import React from "react";

const Item = ({ listObj, isBuyer}) => {
    return (
        <div className="Itemclass">
            {isBuyer ? (<>
                <div>
                <h4>구매자 이름: {`${listObj.name}`}</h4>
                <h4>구매 수량: {`${listObj.count}`}</h4>
                <h4>전화번호: {`${listObj.phonenumber}`}</h4>
                <br></br>
                </div>
                </>
            ): (<></>) }
        
        </div>
    );
};
export default Item;