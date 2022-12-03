import React, { useEffect, useState } from 'react'
import './LeftPanelStyle.css'

// Services
import FetchUsers from '../services/FetchUsers'
import FetchSolicitations from '../services/FetchSolicitations'
import FetchMessages from '../services/FetchMessages'
import SendMessage from '../services/SendMessage'
import SendSolicitation from '../services/SendSolicitation'
import DeleteSolicitation from '../services/DeleteSolicitation'
import AcceptSolicitation from '../services/AcceptSolicitation'

// MUI Features
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Zoom';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Badge from '@mui/material/Badge';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Outros componentes
import MiniProfileCard from './MiniProfileCard';
import RightPanel from './RightPanel';
import CardFriends from './CardsFriends';


function LeftPanel({ user, acesso, uploadTheme }) {

  const [theme, setTheme] = useState(false)

  const [messages, setMessages] = useState([])
  const [messageValue, setMessageValue] = useState('')
  const [solicitacoes, setSolicitacoes] = useState([])
  const [solicitacoesId, setSolicitacoesId] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [pedidosId, setPedidosId] = useState([])
  const [amigosId, setAmigosId] = useState([])

  const [userLogado, setUserLogado] = useState(user)
  const [uExposed, setUExposed] = useState(userLogado)
  const [users, setUsers] = useState([])
  const [alertMessage, setAlertMessage] = useState(false)
  const [timer, setTimer] = useState(false)
  const [scene, setScene] = useState('chat')
  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const data = await FetchUsers()

      setUsers(data.map((user, k) => ({ ...user })))
      setUserLogado(data.filter(user => user.id === userLogado.id)[0])
      setAmigosId(userLogado.amigos.map(a => ({ ...a })))

    }
    fetchData()
  }, [timer])
  //[timer], [messageValue]

  useEffect(() => {
    async function fetchData() {
      const data = await FetchSolicitations()

      let arr1 = data.filter(sol => sol.origem === userLogado.id)
      let arr2 = data.filter(sol => sol.destino === userLogado.id)
      let arr3 = []
      let arr4 = []

      data.map((s) => {
        if (s.origem === userLogado.id) {
          arr3.push(s.destino)
        }
        if (s.destino === userLogado.id) {
          arr4.push(s.origem)
        }
      })

      setSolicitacoes(arr1)
      setSolicitacoesId(arr3)
      setPedidos(arr2)
      setPedidosId(arr4)
    }
    fetchData()
  }, [timer])

  useEffect(() => {
    async function fetchData() {
      const data = await FetchMessages()
      setMessages(data.map((message, k) => ({ ...message })))
    }
    fetchData()
  }, [timer])


  async function sendMessage(e) {
    e.preventDefault()
    setMessageValue("")

    if (messageValue.trim().length === 0) {
      setMessageValue('')
      setAlertMessage(true)
      setTimeout(() => {
        setAlertMessage(false)
      }, 2000);
      return
    }

    const newMessage = {
      autor: userLogado.email,
      hora: new Date,
      valor: messageValue
    }

    await SendMessage(newMessage)
  }


  async function addFriend(id) {
    await SendSolicitation(id, userLogado.id)
    setTrigger(!trigger)
  }

  async function acceptSolicitation(userAcepted) {

    await AcceptSolicitation(userAcepted, userLogado)
    await deleteInvite(userAcepted)

    setTrigger(!trigger)
  }

  async function deleteSolicitation(userAcepted) {
    const solicitation = solicitacoes.find(s => s.destino === userAcepted.id)
    if (solicitation) {
      await DeleteSolicitation(solicitation)
    }
    setTrigger(!trigger)
  }

  async function deleteInvite(userAcepted) {
    const solicitation = pedidos.find(s => s.origem === userAcepted.id)
    if (solicitation) {
      await DeleteSolicitation(solicitation)
    }
    setTrigger(!trigger)
  }

  function userExposed(uE) {
    setTrigger(!trigger)
    setUExposed(uE)
    setScene("exposed")
  }

  function organizeMessages() {
    messages.sort(function (a, b) {
      if (a.hora._compareTo(b.hora) === 1) {
        return -1
      } else {
        return true
      }
    })
  }

  function autorName(mensagem) {
    return users.find(u => u.email === mensagem.autor)
  }

  function formatData(m) {
    return m.hora.toDate().getHours() + ":" + m.hora.toDate().getMinutes()
  }

  function exit() {
    acesso()
  }

  function goChat() {
    setScene('chat')
  }

  function goProfile() {
    setScene('profile')
  }

  function goFriends() {
    setScene('friends')
  }

  function refreshInvites() {
    setTrigger(!trigger)
  }

  function refreshUser(u) {
    setUserLogado(u)
    setUExposed(userExposed.id === u.id ? u : uExposed)
    setTrigger(!trigger)
  }

  function changeTheme() {
    uploadTheme(!theme)
    setTheme(!theme)
  }

  return (

    <div className='left'>
      <h5 style={{ display: "none" }}>
        {organizeMessages()}
        {setTimeout(() => {
          setTimer(!timer)
        }, 3000)}
      </h5>
      {scene !== "friends" && scene !== "profile" && (
        <div className="chat-container">
          <div className="profile-friend">
            <div className="card-perfil" style={theme ? { backgroundColor: "rgb(50, 49, 49)" } : {}}>
              <img className='picture-profile' src={uExposed.img} alt="perfil" />
              <div className="ballon-profile" style={theme ? { backgroundColor: "rgb(50, 49, 49)", flexDirection: "column" } : { flexDirection: "column" }}>
                <div className="nome" style={theme ? { alignSelf: "flex-start", color: "white", backgroundColor: "rgb(50, 49, 49)", borderColor: "#ed6c02" } : { alignSelf: "flex-start" }}>
                  <p style={{ float: "left" }}>Nome</p>
                  <h1>{uExposed.nome}</h1>
                </div>
                <div className="bio" style={theme ? { wordWrap: "break-word" } : { color: "black" }}>
                  <p style={{ alignSelf: "flex-start" }}>Biografia</p>
                  <h3 style={{ wordBreak: "break-word" }} >{uExposed.bio ? uExposed.bio : "Este usuário não possui nenhuma Bio"}</h3>
                </div>
                {!pedidosId.includes(uExposed.id) && (
                  uExposed.id !== userLogado.id && !userLogado.amigos.includes(uExposed.id) && (
                    solicitacoesId.includes(uExposed.id) ? (
                      <Fab variant="extended" color='error' size="medium" onClick={() => deleteSolicitation(uExposed)}>
                        <PersonRemoveIcon />
                        Cancelar Solicitação
                      </Fab>
                    ) : (
                      <Fab variant="extended" color='success' size="medium" onClick={() => addFriend(uExposed.id)}>
                        <PersonAddAlt1Icon />
                        Adicionar aos amigos
                      </Fab>
                    )
                  )
                )}
                {(pedidosId.includes(uExposed.id)) && (!userLogado.amigos.includes(uExposed.id)) && (
                  <div className="optionsInvite">
                    <Fab variant="extended" color='info' size="medium" onClick={() => acceptSolicitation(uExposed)}>
                      <CheckIcon />
                      Aceitar
                    </Fab>
                    <Fab variant="extended" color='error' size="medium" onClick={() => deleteInvite(uExposed)}>
                      <CloseIcon />
                      Recusar
                    </Fab>
                  </div>
                )}
                {userLogado.amigos.includes(uExposed.id) && (
                  <div className='amigos' style={{ alignSelf: 'flex-end' }}>
                    <PeopleAltIcon />
                    Amigo
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="chat" style={theme ? { backgroundColor: "rgb(50, 49, 49)" } : { backgroundColor: "white" }}>
            <div className="navigation-group">
              <Fab variant="extended" color='error' size="medium" aria-label="add" onClick={exit}>
                <LogoutIcon />
                Sair
              </Fab>
              <Fab variant="extended" color="secondary" size="medium" aria-label="add" onClick={goFriends}>
                <Badge badgeContent={pedidos.length} color="error">
                  <GroupsIcon />
                  Amigos
                </Badge>
              </Fab>
              <Fab variant="extended" size="medium" aria-label="add" onClick={goProfile}>
                <AccountCircleIcon />
                Perfil
              </Fab>

            </div>

            {scene === "exposed" && (
              <MiniProfileCard theme={theme} deleteSolicitation={deleteSolicitation} userLogado={userLogado} user={uExposed} back={goChat} solicitations={solicitacoesId} invites={pedidosId} addUser={addFriend} cancelSolicitation={deleteInvite} acceptSolicitation={acceptSolicitation} updateInvites={refreshInvites} />
            )}

            {alertMessage && (
              <Zoom in={alertMessage} style={{ transitionDelay: alertMessage ? '0ms' : '0ms' }}>
                <Alert variant="filled" severity="error" Tran>
                  Digite o corpo da mensagem
                </Alert>
              </Zoom>
            )}
            <div className="view-messages">
              {!messages[0] && (
                <CircularProgress size={100} style={!messages[0] ? { alignSelf: "center" } : { alignSelf: "center", display: "none" }} />
              )}
              {messages.length > 0 && (
                messages.map((m, k) => (
                  <div key={k} className="message" onClick={() => userExposed(autorName(m))} style={m.autor === userLogado.email ? { alignSelf: "flex-end", borderRadius: "6px 0px 6px 6px", backgroundColor: "rgba(255, 255, 255, 0.677)" } : { color: "white" }}>
                    <h4>{autorName(m).nome}</h4>
                    <h3>{m.valor}</h3>
                    <p>{formatData(m)}</p>
                  </div>
                ))
              )}
              <Fab color="inherit" aria-label="add" className='floating-theme-button' style={{ position: "fixed", margin: "5px", backgroundColor: "rgba(255, 255, 255, 0.243)" }} onClick={changeTheme}>
                {theme ? <Brightness7Icon /> : <Brightness4Icon />}

              </Fab>
            </div>
            <form className='form-chat' onSubmit={(e) => sendMessage(e)}>
              <div className="chat-input-group">
                <input style={theme ? { color: "white" } : {}} onChange={(e) => setMessageValue(e.target.value)} value={messageValue} type="text" name="mensagem" className='menssage-input' />
                <IconButton onClick={sendMessage} color={theme ? "warning" : "success"}>
                  <SendIcon fontSize='medium' style={{ padding: "0px" }}></SendIcon>
                </IconButton>
              </div>
            </form>
          </div>
        </div>
      )}
      {scene === 'profile' && (
        <RightPanel theme={theme} refreshUser={refreshUser} className="right" user={userLogado} goBack={goChat} />
      )}

      {scene === 'friends' && (
        <CardFriends changeScene={goChat} userLogado={userLogado} users={users} acesso={true} />
      )}
    </div>
  )
}

export default LeftPanel