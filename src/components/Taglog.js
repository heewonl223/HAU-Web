import { dbService } from "fbase";
import React, { useState } from "react";

const Taglog = ({taglogObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newTaglog, setNewTaglog] = useState(taglogObj.text); // update text in input
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tag?");
        if (ok) {
            await dbService.doc(`taglogs/${taglogObj.id}`).delete();    // orange records == collection name
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>  {
        event.preventDefault();
        console.log(taglogObj, newTaglog);
        await dbService.doc(`taglogs/${taglogObj.id}`).update({
            text: newTaglog,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewTaglog(value);
    };
    return (
        <div>
            {
                editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit}>
                                <input type="text" placeholder="Edit your tag" value={newTaglog} required onChange={onChange} />
                                <input type="submit" value="Add tag" />
                            </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </>
                    )}
                </>
                ) : (
                <>
                    <h4>{taglogObj.text}</h4>
                    {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Delete Tag</button>
                        <button onClick={toggleEditing}>Edit Tag</button>
                    </>
                    )}
                </>
                )}
        </div>
    );
};