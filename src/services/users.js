
export async function getUserLogged() {

    const userId= getUserLogged();
    if(userId){
        const ref = doc(db,'user',userId)
        const dataUser= await getDoc(ref)
        return {...dataUser.data()}
    }


}

export function getUserId(){
    return JSON.parse(localStorage.getItem('user_logged')) || false;
}