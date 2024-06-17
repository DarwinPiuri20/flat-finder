import axios from "axios";

export class Api {

    urlBase= '';
    token = '';

    constructor() {
        this.urlBase = 'http://localhost:3000/';
        this.token = JSON.parse(localStorage.getItem('user_logged'));
        if (this.token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }


    }

    post = (url, data) => {
        return axios.post(this.urlBase + url, data);
    }

    get = (url) => {

        return axios.get(this.urlBase + url);
    }


}