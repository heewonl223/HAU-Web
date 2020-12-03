import React, {useEffect, useState} from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import Result from "components/Result";

const Diagnosis = ({userObj}) => {
    const [result, setResult] = useState("");
    const [results, setResults] = useState([]);
    const [attachment, setAttachment] = useState();
    useEffect(() => {
        // snapshot : any change in database -> alert
        dbService.collection("results").onSnapshot((snapshot) => {
            const resultArray = snapshot.docs.map(doc => ({
                // every item on array will look like this
                id:doc.id,
                ...doc.data(),
            }));
            setResults(resultArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
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
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }; 
        await dbService.collection("results").add(resultObj);
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
        <form onSubmit={onSubmit}>
            <input value={result} onChange={onChange} type="text" placeholder="Upload Diagnosis" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Upload" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
        <div>
            {results.map((result) => (
                // record.js helps keep code short
                // create record(daily log) component
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
export default Diagnosis;
