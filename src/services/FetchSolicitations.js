import { collection, getDocs } from "firebase/firestore";
import { db } from '../db/firebase-config'

const solicitacoesCollectionRef = collection(db, 'solicitacoes')

export default async function fetch() {
    const data = await getDocs(solicitacoesCollectionRef)
    let arr = []
    data.docs.map((s, k) => {
        const sol = {
            id: s.id,
            origem: s.data().origem,
            destino: s.data().destino,
        }
        arr.push(sol)
    })
    return arr
}