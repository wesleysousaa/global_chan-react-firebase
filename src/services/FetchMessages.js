import { collection, getDocs } from "firebase/firestore";
import { db } from '../db/firebase-config'

const messagesCollectionRef = collection(db, 'messages')

export default async function fetch() {
    const data = await getDocs(messagesCollectionRef)
    return data.docs.map((message) => ({ ...message.data() }))
}