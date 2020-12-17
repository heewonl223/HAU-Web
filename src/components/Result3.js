import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Result3 = ({resultObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newResult, setNewResult] = useState(resultObj.text); // update text in input
    
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this diagnosis?");
        if (ok) {
            await dbService.doc(`results_list_1/${resultObj.id}`).delete();    
            await storageService.refFromURL(resultObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>  {
        event.preventDefault();
        await dbService.doc(`results_list_1/${resultObj.id}`).update({
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
        <div>
            {
                editing ? (
                <>
                    {isOwner && (
                        <>
                        <div>{resultObj.createdAt}</div>
                            <form onSubmit={onSubmit} className="result_container resultEdit">
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
                <div className="result">
                    {isOwner && (
                        <div className="result_container">
                            <div>{resultObj.createdAt}</div>
                            <div>{resultObj.text}</div>
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
                )}
        </div>
    );
};

export default Result3;