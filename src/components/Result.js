import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Result = ({resultObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newResult, setNewResult] = useState(resultObj.text); // update text in input
    const [newTag, setNewTag] = useState(resultObj.hash);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this diagnosis?");
        if (ok) {
            await dbService.doc(`results_list/${resultObj.id}`).delete();    
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
                            <form onSubmit={onSubmit} className="result_container resultEdit">
                                <input 
                                    type="text" 
                                    placeholder="Edit your diagnosis result" 
                                    value={newResult} 
                                    required 
                                    onChange={onChange}
                                    className="result_formInput"
                                />
                                <input type="hash"
                                    placeholder="Edit your tag"
                                    value={newTag}
                                    required
                                    onChange={onChange2}
                                    className="result_formInput"
                                />
                                <input 
                                    type="submit" 
                                    value="Update diagnosis result"
                                    className="result_editUpdateBtn" 
                                />
                                <input 
                                    onClick={toggleEditing} 
                                    className="result_editCancelBtn"
                                    value="Cancel"
                                />
                            </form>
                        </>
                    )}
                </>
                ) : (
                <>
                <div className="result">
                    {isOwner && (
                        <div className="result_container">
                            <h4>Diagnosis:{resultObj.text}</h4>
                            <h4>Tag:{resultObj.hash}</h4>
                            <div>
                            {resultObj.attachmentUrl && (
                                <img src={resultObj.attachmentUrl} />
                            )}
                            </div>
                        </div>
                    )}
                    {isOwner && (
                    <div className="result_BtnContainer">
                        <button 
                            onClick={toggleEditing} 
                            className ="result_editBtn">
                                Edit diagnosis result
                            </button>
                        <button 
                            onClick={onDeleteClick} 
                            className ="result_deleteBtn">
                                Delete diagnosis result
                        </button>
                    </div>
                    )}
                </div>
                </>
                )}
        </div>
    );
};

export default Result;
