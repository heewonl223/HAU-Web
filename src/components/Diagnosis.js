import React, {useEffect, useState} from "react";
import { dbService } from "fbase";
import Result from "components/Result";

const Diagnosis = ({userObj}) => {
    const [result, setResult] = useState("");
    const [results, setResults] = useState([]);
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
        await dbService.collection("results").add({
            text: result,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        // submit(save) 이후 빈칸 만들기
        setResult("");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setResult(value);
    };
    console.log(results);
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input value={result} onChange={onChange} type="text" placeholder="Upload Diagnosis" maxLength={120} />
            <input type="submit" value="Upload" />
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