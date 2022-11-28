import React, { useEffect, useState } from 'react'
import './CardFriendsStyle.css'
import { getDocs, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import CardFriend from './CardFriend'
import { db } from '../db/firebase-config'
import Fab from '@mui/material/Fab';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Badge from '@mui/material/Badge';

function CardFriends({ changeScene, userLogado, users, acesso }) {

  const solicitacoesCollectionRef = collection(db, 'solicitacoes')

  const [friendsObj, setFriendsObj] = useState([])
  const [trigger, setTrigger] = useState(false)
  const [scene, setScene] = useState('friends')
  const [usersInvited, setUsersInvited] = useState([])
  const [solicitacoes, setSolicitacoes] = useState([])
  const [timer, setTimer] = useState(false)


  useEffect(() => {
    let arr = []
    let arr1 = []
    async function fetchData() {
      const data = await getDocs(solicitacoesCollectionRef)

      await data.docs.map((s, k) => {
        const sol = {
          id: s.id,
          origem: s.data().origem,
          destino: s.data().destino,
        }

        if (sol.destino === userLogado.id) {
          arr1.push(sol)
          arr.push(sol.origem)
        }
      })

      setSolicitacoes(arr1)
      selectUsers(arr)

    }
    console.log("atualiozou")
    fetchData()
  },  [timer])

  function selectUsers(solicitacoesId) {
    let arr = []
    let arr1 = []

    arr = users.filter(u => userLogado.amigos.includes(u.id))
    arr1 = users.filter(u => solicitacoesId.includes(u.id))

    setFriendsObj(arr)
    setUsersInvited(arr1)
  }

  async function removeFriend(friend) {

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

    setTrigger(!trigger)
  }

  async function cancelSolicitation(u) {
    const solicitation = solicitacoes.find(s => s.origem === u.id)
    const solicitationDoc = doc(db, "solicitacoes", solicitation.id)
    await deleteDoc(solicitationDoc)
    setTrigger(!trigger)
  }

  async function acceptSolicitation(userAcepted) {

    let arr = userLogado.amigos
    let arr1 = userAcepted.amigos ? userAcepted.amigos : []

    arr.push(userAcepted.id)
    arr1.push(userLogado.id)

    let uL = userLogado
    let uA = userAcepted

    uL.amigos = arr
    uA.amigos = arr1

    const userLogadoDoc = doc(db, 'users', userLogado.id)
    await updateDoc(userLogadoDoc, uL)

    const userAceptedDoc = doc(db, 'users', userAcepted.id)
    await updateDoc(userAceptedDoc, uA)

    await cancelSolicitation(userAcepted)

    setTrigger(!trigger)
  }

  return (
    <div className={acesso ? 'friends-smartphone' : 'friends'}>
      <div style={{ display: "none" }}>
        {setTimeout(() => {
          setTimer(!timer)
        }, 5000)}
      </div>
      {scene === 'friends' && (
        <>
          <div className='header-cards-friends'>
            <h1 className='title-cards-friends'>Amigos</h1>

            <Fab variant="extended" color="secondary" size="medium" aria-label="add" onClick={() => setScene('solicitations')}>
              <Badge badgeContent={solicitacoes.length} color="error">
                <PersonAddAlt1Icon />
                Solicitações
              </Badge>
            </Fab>
          </div>
          {friendsObj.length === 0 ? (
            <h2>Você não possui nenhum amigo</h2>
          ) : (
            <div className="list-friends">
              {friendsObj.map((friend, k) => (
                <CardFriend amigo={friend} removeUser={removeFriend} key={k} />
              ))}
            </div>
          )}
          <button className="confirm-button" onClick={() => changeScene('home')}>Voltar</button>
        </>
      )}
      {scene === 'solicitations' && (
        <>
          <h1 className='title-cards-friends'>Solicitações</h1>

          {solicitacoes.length === 0 && (
            <h2>Você não possui nenhuma solicitação de amizade</h2>
          )}
          {usersInvited.map((u, k) => (
            <>
              <div className='friend' key={k}>
                <img src={u.img} className='mini-picture' alt="Foto-amigo" />
                <h4 style={{ margin: '1em' }}>{u.nome}</h4>
                <Fab variant="circular" color='success' size="small" style={{ marginRight: '0.5em' }} onClick={() => acceptSolicitation(u)}>
                  <CheckIcon />
                </Fab>
                <Fab variant="circular" color='error' size="small" onClick={() => cancelSolicitation(u)}>
                  <ClearIcon />
                </Fab>
              </div>
            </>
          ))}
          <button className="confirm-button" onClick={() => changeScene('home')}>Voltar</button>
        </>
      )
      }
    </div >
  )
}

export default CardFriends