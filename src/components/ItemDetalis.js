import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container=styled.div`
    width: 100%;
    margin: auto;
    border: 3px solid #F6F6F6;
    border-radius: 10px;
    background-color:  #F6F6F6;
`;
const BtnCon=styled.div`
    /* margin:0 3px; */
    justify-content: space-around;
    display: flex;
`;
const Btn=styled.button`
    width: 48%;
    background-color: #D9D9D9;
    border-radius:5px;
    color: #5b5b5b;
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
`

//사진 다중업로드
const ItemDetails=(props)=>{
    
    //console.log(props)

    const ta=useRef();
    const [attachment, setAttachment] = useState(false);
    const [fileDataList, setFileDataList] = useState([]);
    const [explain, setExplain] = useState();

    const onChangeImage=(e)=>{ //사진이 선택되면 배열에 사진 채워넣기
        for(const file of e.target.files){ //const file of e.target.files
            const theFile = file; 
            const reader = new FileReader();
            
            reader.onloadend=(finishedEvent)=>{
                const{
                    currentTarget : {result},
                } = finishedEvent;
                setFileDataList((prev)=>[...prev, result]);
            }
            reader.readAsDataURL(theFile);
        }  
        setAttachment(true);
    }

    console.log(fileDataList)

    const onChange=(e)=>{
        const{target:{value},}=e;
        if(e.target.id==="explain"){
            setExplain(value);
        }
    }
    
    /*
    const handleImageUpload = async (fileList) => {
        try {
          const urls = await Promise.all(
            fileList?.map(async (file) => {
              const storageRef = ref(storage, `images/${file.name}`);
               await uploadBytesResumable(storageRef, file);
              return getDownloadURL(storageRef);
            })
          ).then((res) => {
            set_data(res)
          }
          ) 
          alert("성공적으로 업로드 되었습니다");
        } 
        
        catch (err) {
          console.error(err);
        }
    };
      
      
    const set_data = async (url) => {
        const info = {
            content,
            url,
        }
    }
    */

    
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

    const onClearAttachment = () => {
        setAttachment(false)
        setFileDataList(null)
    };
    
    return (
        <Container>
            <input
                className="openjoin_input"
                type="file"
                accept="image/*"
                multiple="multiple"
                onChange={onChangeImage}
            />
            {attachment && (
                <>
                {fileDataList.map((file, index)=>(
                    <div key={index}>
                        <div className="attachment" >
                            <img src={file} alt='상세사진' style={{width: "100px", height: "100px"}}/>
                        </div>
                        <button className="default_Btn_Right_Bottom" onClick={onClearAttachment}>
                        X
                        </button>
                    </div>
                ))}
                </>
            )}

            <input
                id="explain"
                className="openjoin_input"
                value={explain} 
                type="textarea"
                onChange={onChange}
                placeholder="상세 설명을 적어주세요"
                maxLength={300}
            />
        </Container>
    );

}

export default ItemDetails;