import { dbService } from "fbase";
import React, { useState } from "react";

const Record = ({recordObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newRecord, setNewRecord] = useState(recordObj.text); // update text in input
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this log?");
        if (ok) {
            await dbService.doc(`records/${recordObj.id}`).delete();    // orange records == collection name
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>  {
        event.preventDefault();
        console.log(recordObj, newRecord);
        await dbService.doc(`records/${recordObj.id}`).update({
            text: newRecord,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewRecord(value);
    };
    return (
        <div class ="record">
            {
                editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit} className="container recordEdit">
                                <input 
                                    type="text" 
                                    placeholder="Edit your log" 
                                    value={newRecord} 
                                    required 
                                    onChange={onChange} 
                                    className="record_formInput"
                                />
                                <input 
                                    type="submit" 
                                    value="Update daily log" 
                                    className="editUpdateBtn"
                                />
                            </form>
                            <button onClick={toggleEditing} className="editUpdateBtn editCancelBtn">Cancel</button>
                        </>
                    )}
                </>
                ) : (
                <>
                    <h4>{recordObj.text}</h4>
                    {isOwner && (
                    <div>
                        <button onClick={toggleEditing} className ="record_editBtn">Edit Log</button>
                        <button onClick={onDeleteClick} className ="record_deleteBtn">Delete Log</button>
                    </div>
                    )}
                </>
                )}
        </div>
    );
};

export default Record;