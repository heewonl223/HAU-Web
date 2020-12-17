import { dbService } from "fbase";
import React, { useState } from "react";

const Record = ({recordObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newRecord, setNewRecord] = useState(recordObj.text); // update text in input
    const [newTag, setNewTag] = useState(recordObj.hash);
    const [newPart, setNewPart] = useState(recordObj.part);
    const [newDegree, setNewDegree] = useState(recordObj.degree);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this log?");
        if (ok) {
            await dbService.doc(`records_list/${recordObj.id}`).delete();    // orange records == collection name
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>  {
        event.preventDefault();
        await dbService.doc(`records_list/${recordObj.id}`).update({
            text: newRecord,
            hash: newTag,
            part: newPart,
            degree: newDegree
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewRecord(value);
    };
    const onChange2 = (event) => {
        const {
            target: {value},
        } = event;
        setNewTag(value);
    };
    const onChange3 = (event) => {
        const {
            target: {value},
        } = event;
        setNewPart(value);
    };
    return (
        <div>
            {
                editing ? (
                <>
                    {isOwner && (
                        <>
                        <div>{recordObj.createdAt}</div>
                            <form onSubmit={onSubmit} className="record_container recordEdit">
                                <input 
                                    type="text" 
                                    placeholder="Edit your log" 
                                    value={newRecord} 
                                    required 
                                    onChange={onChange} 
                                    className="record_formInput"
                                />
                                <input 
                                    type="hash" 
                                    placeholder="Edit your tag" 
                                    value={newTag} 
                                    required 
                                    onChange={onChange2} 
                                    className="record_formInput"
                                />
                                <div>
                                    <input 
                                        type="part"
                                        placeholder="Pain Spot"
                                        value={newPart} 
                                        required 
                                        onChange={onChange3} 
                                        className="record_formInput"
                                    />
                                    <span onClick={()=>{if (newDegree>0)setNewDegree(newDegree-1)}}>😊</span>
                                    <span>{newDegree}</span>
                                    <span onClick={()=>{if (newDegree<10)setNewDegree(newDegree+1)}}>😷</span>
                                </div>
                                <input 
                                    type="submit" 
                                    value="Update daily log" 
                                    className="record_editUpdateBtn"
                                />
                                <input 
                                    onClick={toggleEditing} 
                                    className="record_editCancelBtn"
                                    value="Cancel"
                                />
                            </form>
                        </>
                    )}
                </>
                ) : (
                    <div>
                        {isOwner && (
                            <div className="record_container">
                                <div>{recordObj.createdAt}</div>
                                <div>📃 {recordObj.text}</div>
                                <div>⭐ {recordObj.hash}</div>
                                <div>{recordObj.part}:{recordObj.degree}</div>
                            </div>
                        )}
                        {isOwner && (
                            <div className="record_BtnContainer">
                                <button 
                                    onClick={toggleEditing} 
                                    className ="record_editBtn">
                                        Edit Log
                                </button>
                                <button 
                                    onClick={onDeleteClick} 
                                    className ="record_deleteBtn">
                                        Delete Log
                                    </button>
                            </div>
                        )}
                    </div>
                    )}
            </div>
        );
    };
    
    export default Record;
