import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Result = ({resultObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newResult, setNewResult] = useState(resultObj.text); // update text in input
    const [newTag, setNewTag] = useState(resultObj.tag);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this diagnosis?");
        if (ok) {
            await dbService.doc(`results/${resultObj.id}`).delete();    // orange records == collection name
            await storageService.refFromURL(resultObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>  {
        event.preventDefault();
        await dbService.doc(`results_list/${resultObj.id}`).update({
            text: newResult,
            hash: newTag,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewResult(value);
    };
    const onChange2 = (event) => {
        const {
            target: {value},
        } = event;
        setNewTag(value);
    };
    return (
        <div>
            {
                editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit}>
                                <input type="text" placeholder="Edit your diagnosis result" value={newResult} required onChange={onChange} />
                                <input type="hash" placeholder="Edit your tag" value={newTag} required onChange={onChange2} />
                                <input type="submit" value="Update diagnosis result" />
                            </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </> 
                    )}
                </>
                ) : (
                <>
                    <h4>{resultObj.text}</h4>
                    <h4>{resultObj.hash}</h4>
                    {resultObj.attachmentUrl && (
                        <img src={resultObj.attachmentUrl} width="50px" height="50px" />
                    )}
                    {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Delete diagnosis result</button>
                        <button onClick={toggleEditing}>Edit diagnosis result</button>
                    </>
                    )}
                </>
                )}
        </div>
    );
};

export default Result;