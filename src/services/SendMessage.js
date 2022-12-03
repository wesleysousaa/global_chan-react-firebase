import { db } from '../db/firebase-config'
import { collection, addDoc } from 'firebase/firestore'

const messagesCollectionRef = collection(db, 'messages')

export default async function SendMessage(message){
    await addDoc(messagesCollectionRef, message)
}