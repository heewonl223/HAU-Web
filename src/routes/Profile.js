import React from "react";
import { authService } from "fbase";

export default () => {
    const onLogOutClick = () => authService.signOut();
    return (
        <form>
            <button onClick={onLogOutClick} className ="logSubmit logout">
                Log Out
            </button>
        </form>
    );
};