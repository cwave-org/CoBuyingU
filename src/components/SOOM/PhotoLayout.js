import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import styled from "styled-components";

const Layout=styled.div`
    border-radius: 5px;
    /* border: 2px solid white; */
    /* border-top: 1px solid #9b9b9b; */
    background-color:  white;
`;
const Add=styled.div`
    display: flex;
    margin: 5px 0;
    padding: 3px;
    background-color: #f6f6f6;
    /* border: 1px solid white; */
`;
const Half = styled.div`
    width: 50%;
`;
const TextArea=styled.textarea`
    width: 100%;
    height: 60px;
    overflow: visible;
    resize: none;
    border: none;
`;
const PhotoLayout=(props)=>{
    const ta=useRef();
    const [attachment, setAttachment] = useState('');
    const [detail,setDetail]=useState('');
    useEffect(()=>{
        props.setData([{id:props.id,url:attachment,content:detail}, ...props.data]);
    },[detail,attachment,props.id]);
    const handleResizeHeight=(event)=>{
        if(ta.current.scrollHeight>60){
            ta.current.style.height=ta.current.scrollHeight+'px';
        }
        const {
            target: { value },
          } = event;
        setDetail(value);
    }
    const onFileChange = (event) => {
        const {
          target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
          const {
            currentTarget: { result },
          } = finishedEvent;
          setAttachment(result);
        };
        reader.readAsDataURL(theFile);
      };
      const onClearAttachment = () => setAttachment(null);
    
    return(
        <Layout id={props.id}>
            <Add>
            <Half>
                <input
                className="openjoin_input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                />
                {attachment && (
                    <>
                    <div className="attatchment" style={{position:'relative'}}>
                        <img src={attachment} alt='상세사진'/>
                        <button className="default_Btn_Right_Bottom" onClick={onClearAttachment}>
                        X
                    </button>
                    </div>
                    </>
                )}
            </Half>
            <Half>
                <TextArea
                    placeholder="사진에 대한 상세 설명을 작성해주세요." 
                    ref={ta} rows={1} onChange={handleResizeHeight}/>
            </Half>
        </Add>
        </Layout>
    )
}
export default PhotoLayout;