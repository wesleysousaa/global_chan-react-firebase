import { db } from '../db/firebase-config'
import { collection, addDoc } from 'firebase/firestore'

const solicitacoesCollectionRef = collection(db, 'solicitacoes')

export default async function SendSolicitation(idDestino, idOrigem){
    await addDoc(solicitacoesCollectionRef, { origem: idOrigem, destino: idDestino })
}