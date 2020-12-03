import { dbService } from "fbase";
import React, { useState } from "react";

const Tagdia = ({tagdiaObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // for true false
    const [newTagdia, setNewTagdia] = useState(tagdiaObj.text); // update text in input
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tag?");
        if (ok) {
            await dbService.doc(`tagdias/${tagdiaObj.id}`).delete();    // orange records == collection name
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) =>  {
        event.preventDefault();
        console.log(tagdiaObj, newTagdia);
        await dbService.doc(`tagdias/${tagdiaObj.id}`).update({
            text: newTagdia,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewTagdia(value);
    };
    return (
        <div>
            {
                editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit}>
                                <input type="text" placeholder="Edit your tag" value={newTagdia} required onChange={onChange} />
                                <input type="submit" value="Add tag" />
                            </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </>
                    )}
                </>
                ) : (
                <>
                    <h4>{tagdiaObj.text}</h4>
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