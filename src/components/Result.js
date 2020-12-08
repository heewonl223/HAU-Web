import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Result = ({resultObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newResult, setNewResult] = useState(resultObj.text); // update text in input
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this diagnosis?");
        if (ok) {
            await dbService.doc(`results/${resultObj.id}`).delete();    
            await storageService.refFromURL(resultObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>  {
        event.preventDefault();
        console.log(resultObj, newResult);
        await dbService.doc(`results/${resultObj.id}`).update({
            text: newResult,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewResult(value);
    };
    return (
        <div class ="result">
            {
                editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit} className="container resultEdit">
                                <input 
                                    type="text" 
                                    placeholder="Edit your diagnosis result" 
                                    value={newResult} 
                                    required 
                                    onChange={onChange}
                                    className="result_formInput"
                                />
                                <input 
                                    type="submit" 
                                    value="Update diagnosis result"
                                    className="editUpdateBtn" 
                                />
                            </form>
                            <button onClick={toggleEditing} className="editUpdateBtn editCancelBtn">Cancel</button>
                        </>
                    )}
                </>
                ) : (
                <>
                    <h4>{resultObj.text}</h4>
                    {resultObj.attachmentUrl && (
                        <img src={resultObj.attachmentUrl} />
                    )}
                    {isOwner && (
                    <>
                        <button onClick={toggleEditing} className ="result_editBtn">Edit diagnosis result</button>
                        <button onClick={onDeleteClick} className ="result_deleteBtn">Delete diagnosis result</button>
                    </>
                    )}
                </>
                )}
        </div>
    );
};

export default Result;