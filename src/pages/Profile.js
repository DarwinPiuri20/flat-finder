import React from "react";
import UserForm from "../components/UserForm";
import Header from "../components/Header";

export default function Profile() {
    return (
        <div>
            <Header/>
            <UserForm type={'view'}/>
        </div>
    );
}