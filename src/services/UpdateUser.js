import { db } from '../db/firebase-config'
import { updateDoc, doc } from 'firebase/firestore'


export default async function UpdateUser(idUser, userUpdated){
    const userLogadoDoc = doc(db, 'users', idUser)
    await updateDoc(userLogadoDoc, userUpdated)
}