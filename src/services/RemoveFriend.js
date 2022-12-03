import { doc, updateDoc } from "firebase/firestore"
import { db } from '../db/firebase-config'

export default async function removeFriend(friend, friendsObj, userLogado) {

    let arr = friendsObj.filter(f => f.id !== friend.id)
    userLogado.amigos = []

    arr.forEach(v => {
        userLogado.amigos.push(v.id)
    })
    friend.amigos = friend.amigos.filter(f => f !== userLogado.id)

    const userDoc = doc(db, 'users', userLogado.id)
    await updateDoc(userDoc, userLogado)

    const FriendDoc = doc(db, 'users', friend.id)
    await updateDoc(FriendDoc, friend)

    return userLogado

}