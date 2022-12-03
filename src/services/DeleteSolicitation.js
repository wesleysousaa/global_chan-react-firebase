import { db } from '../db/firebase-config'
import { deleteDoc, doc } from 'firebase/firestore'

export default async function DeleteSolicitation(solicitation){
    const solicitationDoc = doc(db, 'solicitacoes', solicitation.id)
    await deleteDoc(solicitationDoc)
}