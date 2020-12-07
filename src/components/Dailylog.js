import React, {useEffect, useState} from "react";
import { dbService } from "fbase";
import Record from "components/Record";
import PainGraph from "components/PainGraph";

const Dailylog = ({userObj}) => {
    const [record, setRecord] = useState("");
    const [records, setRecords] = useState([]);
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState([]);

    const [bodyPart,setBodyPart] = useState("");
    const [painDegree,setpainDegree]=useState(0);

    
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
            part: bodyPart,
            degree: painDegree
        });
        // submit(save) 이후 빈칸 만들기
        setRecord("");
        setTag("");
        setBodyPart("");
        setpainDegree(0);
        
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
    const onChange3 = (event) => {
        const {
            target: {value},
        } = event;
        setBodyPart(value);
    };
    return (
    <div>
        <form onSubmit={onSubmit}>
            <div>
                <input value={bodyPart} onChange={onChange3} type="bodyPart" placeholder="어디가 아프신감?" maxLength={10}/>
                <span onClick={()=>{if (painDegree>0)setpainDegree(painDegree-1)}}>😊</span>
                <span>{painDegree}</span>
                <span onClick={()=>{if (painDegree<10)setpainDegree(painDegree+1)}}>😷</span>
            </div>
            <div>
                <input value={record} onChange={onChange} type="text" placeholder="Writing My Daily Log" maxLength={120} />
                <input value={tag} onChange={onChange2} type="hash" placeholder="Writing My Tag" maxLength={90} />
                <input type="submit" value="Save" />
            </div>
        </form>
        <div>
            <PainGraph userObj={userObj}/>
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