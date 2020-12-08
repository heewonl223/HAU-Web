import React, {useEffect, useState} from "react";
import { dbService } from "fbase";
import Record from "components/Record";

const Dailylog = ({userObj}) => {
    const [record, setRecord] = useState("");
    const [records, setRecords] = useState([]);
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState([]);
    useEffect(() => {
        // snapshot : any change in database -> alert
        dbService.collection("records_list")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            const recordArray = snapshot.docs.map(doc => ({
                // every item on array will look like this
                id:doc.id,
                ...doc.data(),
            }));
            const tagArray = snapshot.docs.map(doc => ({
                // every item on array will look like this
                id:doc.id,
                ...doc.data(),
            }));
            setRecords(recordArray);
            setTags(tagArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("records_list").add({
            text: record,
            hash: tag,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        // submit(save) 이후 빈칸 만들기
        setRecord("");
        setTag("");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setRecord(value);
    };
    const onChange2 = (event) => {
        const {
            target: {value},
        } = event;
        setTag(value);
    }; 
    console.log(record);
    return (
    <div>
        <form onSubmit={onSubmit} className="dailylogForm">
            <div className="dailylogInput__container">
            <textarea rows="4" cols="50"
                className="dailylogInput__input"
                value={record} 
                onChange={onChange} 
                type="text" 
                placeholder="Writing My Daily Log"
                maxLength={1000} 
            />
            <input value={tag}
                className="dailylogInput__input"
                onChange={onChange2}
                type="hash"
                placeholder="Writing My Tag"
                maxLength={90} />
            <input 
                type="submit" 
                value="Upload" 
                className="dailylogInput__arrow"
            />
            </div>
        </form>
        <div>
            {tags.map((tag) => (
                // record.js helps keep code short
                // create record(daily log) component
                <Record
                    key={tag.id}
                    recordObj={tag}
                    isOwner={tag.creatorId === userObj.uid} // userObj comes from props(given by Router) of Home
                />
            ))}
        </div>
    </div>
    );
};
export default Dailylog;