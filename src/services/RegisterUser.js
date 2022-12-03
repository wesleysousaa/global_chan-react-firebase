import { db } from '../db/firebase-config'
import { collection, addDoc } from 'firebase/firestore'
const usersCollectionRef = collection(db, 'users')

export default async function RegisterUser(user){
    await addDoc(usersCollectionRef, user)
}