import React, {useEffect, useState} from "react";
import { dbService } from "fbase";
import Record from "components/Record";

const Dailylog = ({userObj}) => {
    const [record, setRecord] = useState("");
    const [records, setRecords] = useState([]);
    useEffect(() => {
        // snapshot : any change in database -> alert
        dbService.collection("records")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            const recordArray = snapshot.docs.map(doc => ({
                // every item on array will look like this
                id:doc.id,
                ...doc.data(),
            }));
            setRecords(recordArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("records").add({
            text: record,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        // submit(save) 이후 빈칸 만들기
        setRecord("");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setRecord(value);
    };
    console.log(records);
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input value={record} onChange={onChange} type="text" placeholder="Writing My Daily Log" maxLength={120} />
            <input type="submit" value="Upload" />
        </form>
        <div>
            {records.map((record) => (
                // record.js helps keep code short
                // create record(daily log) component
                <Record
                    key={record.id}
                    recordObj={record}
                    isOwner={record.creatorId === userObj.uid} // userObj comes from props(given by Router) of Home
                />
            ))}
        </div>
    </div>
    
    );
};
export default Dailylog;