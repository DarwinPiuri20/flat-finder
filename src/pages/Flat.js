import React from "react";
import Header from "../components/Header";
import ViewFlat from "../components/ViewFlat";  
import checkUsserLogged from "../services/action";
export default function Flat() {
    checkUsserLogged();
    return (
        <div>
            <Header />
            <ViewFlat />
        </div>
    );
}