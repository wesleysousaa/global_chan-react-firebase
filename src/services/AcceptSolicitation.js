import UpdateUser from '../services/UpdateUser'

export default async function AcceptSolicitation(userAcepted, userLogado) {

    if (userLogado.amigos.includes(userAcepted.id)) {
        return
    }

    let uL = userLogado
    let uA = userAcepted

    uL.amigos.push(userAcepted.id)
    uA.amigos.push(userLogado.id)

    await UpdateUser(userLogado.id, uL)
    await UpdateUser(userAcepted.id, uA)


}