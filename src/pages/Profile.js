import React from "react";
import UserForm from "../components/UserForm";
import Header from "../components/Header";
import checkUserLogged from "../services/action";

export default function Profile() {
    checkUserLogged();
    return (
        <div>
            <Header/>
            <UserForm type={'view'}/>
        </div>
    );
}