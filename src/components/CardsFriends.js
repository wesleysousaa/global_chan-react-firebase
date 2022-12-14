import React, { useEffect, useState } from 'react'
import './CardFriendsStyle.css'

// Outros Componentes
import CardFriend from './CardFriend'

// MUI features
import Fab from '@mui/material/Fab';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Badge from '@mui/material/Badge';

// Services
import AcceptSolicitation from '../services/AcceptSolicitation'
import DeleteSolicitation from '../services/DeleteSolicitation'
import RemoveFriend from '../services/RemoveFriend'
import FetchUsers from '../services/FetchUsers'
import FetchSolicitations from '../services/FetchSolicitations'

// Hooks
import { useUserContext } from '../hooks/useUserContext';
import { useUsersContext } from '../hooks/useUsersContext';

function CardFriends({ changeScene, acesso }) {

  const [friendsObj, setFriendsObj] = useState([])
  const [cena, setCena] = useState('friends')
  const [usersInvited, setUsersInvited] = useState([])
  const [solicitacoes, setSolicitacoes] = useState([])
  const [timer, setTimer] = useState(false)

  const {userLogado, setUserLogado} = useUserContext()
  const {users} = useUsersContext()

  const [usersL, setUsersL] = useState(users)

  useEffect(() => {
    let arr = []
    let arr1 = []
    async function fetchData() {
      const data = await FetchSolicitations()

      data.map((s, k) => {
        if (s.destino === userLogado.id) {
          arr1.push(s)
          arr.push(s.origem)
        }
      })

      setSolicitacoes(arr1)
      selectUsers(arr)
    }
    fetchData()
  }, [timer])

  useEffect(() => {
    async function fetchData() {
      const data = await FetchUsers()

      setUserLogado(data.filter(u => u.id === userLogado.id)[0])
      setUsersL(data)
      selectUsers()

    }
    fetchData()
  }, [timer])

  function selectUsers(solicitacoesId) {
    let arr = []
    let arr1 = []

    arr = usersL.filter(u => userLogado.amigos.includes(u.id))

    if (solicitacoesId) {
      arr1 = usersL.filter(u => solicitacoesId.includes(u.id))
      setUsersInvited(arr1)
    }
    setFriendsObj(arr)
  }

  async function removeFriend(friend) {
    const user = await RemoveFriend(friend, friendsObj, userLogado)
    setUserLogado(user)
    selectUsers()
  }

  async function cancelSolicitation(u) {
    const solicitation = solicitacoes.find(s => s.origem === u.id)
    if (solicitation) {
      await DeleteSolicitation(solicitation)
    }
  }

  async function acceptSolicitation(userAcepted) {
    await AcceptSolicitation(userAcepted, userLogado)
    await cancelSolicitation(userAcepted)
  }

  return (
    <div className={acesso ? 'friends-smartphone' : 'friends'}>
      <div style={{ display: "none" }}>
        {setTimeout(() => {
          setTimer(!timer)
        }, 3000)}
      </div>
      {cena === 'friends' && (
        <>
          <div className='header-cards-friends'>
            <h1 className='title-cards-friends'>Amigos</h1>

            <Fab variant="extended" color="secondary" size="medium" aria-label="add" onClick={() => setCena('solicitations')}>
              <Badge badgeContent={solicitacoes.length} color="error">
                <PersonAddAlt1Icon />
                Solicita????es
              </Badge>
            </Fab>
          </div>
          {friendsObj.length === 0 ? (
            <h2>Voc?? n??o possui nenhum amigo</h2>
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
      {cena === 'solicitations' && (
        <>
          <h1 className='title-cards-friends'>Solicita????es</h1>

          {solicitacoes.length === 0 && (
            <h2>Voc?? n??o possui nenhuma solicita????o de amizade</h2>
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