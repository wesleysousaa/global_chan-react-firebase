import { collection, getDocs } from "firebase/firestore";
import { db } from '../db/firebase-config'

const usersCollectionRef = collection(db, 'users')

export default async function fetch() {
    const data = await getDocs(usersCollectionRef)

      let arr = []
      data.docs.map((user, k) => {
        const u = {
          id: user.id,
          nome: user.data().nome,
          email: user.data().email,
          senha: user.data().senha,
          bio: user.data().bio,
          img: user.data().img,
          amigos: user.data().amigos ? user.data().amigos : []
        }
        arr.push(u)
      })
      return arr
}