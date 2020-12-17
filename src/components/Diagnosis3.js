import React, {useEffect, useState} from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import Result from "components/Result3";
import SubNavigation from "./SubNavigation";

// 보기좋은 시간 반환 함수
Date.prototype.yyyymmdd = function() {
    let MM = this.getMonth() + 1; // getMonth() is zero-based
    let dd = this.getDate();
    let hh = this.getHours();
    let mm = this.getMinutes();
    let ss = this.getSeconds();
  
    return ['📆',this.getFullYear(),'.',
            (MM>9 ? '' : '0') + MM,'.',
            (dd>9 ? '' : '0') + dd,'⏱',
            (hh>9 ? '' : '0') + hh,':',
            (mm>9 ? '' : '0') + mm,':',
            (ss>9 ? '' : '0') + ss
           ].join('');
  };

const Diagnosis3 = ({userObj}) => {
    const [result, setResult] = useState("");
    const [results, setResults] = useState([]);
    const [attachment, setAttachment] = useState("");
    
    useEffect(() => {
        // snapshot : any change in database -> alert
        dbService.collection("results_list_3")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            const resultArray = snapshot.docs.map(doc => ({
                // every item on array will look like this
                id:doc.id,
                ...doc.data(),
            }));
            setResults(resultArray);
            const tagArray = snapshot.docs.map(doc => ({
                // every item on array will look like this
                id:doc.id,
                ...doc.data(),
            }));
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        var date = new Date(); 
        if (result === "") {
            return;
        }
        let attachmentUrl = "";
        if (attachment !== ""){
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const resultObj = {
            text: result,
            createdAt: date.yyyymmdd(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("results_list_3").add(resultObj);
            setResult("");
            setAttachment("");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setResult(value);
    };
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
    return (
    <div>
        <div id = "subNav"><SubNavigation/></div>
        <form onSubmit={onSubmit} className="diagnosisForm">
            <div className="diagnosisInput__container">
                <input 
                    className="diagnosisInput__input"
                    value={result} 
                    onChange={onChange} 
                    type="text" 
                    placeholder="Writing My Diagnosis Result" 
                    maxLength={1000} 
                />
                <input 
                    type="submit" 
                    value="Upload" 
                    className="diagnosisInput__arrow" 
                />
            </div>
            <label for="attach-file" className="diagnosisInput__label">
                <span>Add photos</span>        
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ opacity: 0,}}
            />

            {attachment && (
                <div className="diagnosisForm__attachment">
                    <img
                        src={attachment}
                        style={{
                        backgroundImage: attachment,
                        }}
                    />
                    <div className="diagnosisForm__clear" onClick={onClearAttachment}>
                        <span>Clear</span>
                    </div>
                </div>
            )}
        </form>
        <div>
            {results.map((result) => (
                // result.js helps keep code short
                // create result(diagnosis result) component
                <Result
                    key={result.id}
                    resultObj={result}
                    isOwner={result.creatorId === userObj.uid} // userObj comes from props(given by Router) of Home
                />
            ))}
        </div>
    </div>
    );
};
export default Diagnosis3;