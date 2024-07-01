import axios from "axios";

export class Api {

    urlBase= '';
    token = '';

    constructor() {
        this.urlBase = 'http://localhost:3001/';
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

    patch = (url, data) => {
        return axios.patch(this.urlBase + url, data);
    }
    getUserLogged = () => {

        return axios.get(this.urlBase + 'user/profile');
    } 

}