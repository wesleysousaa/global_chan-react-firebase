import React, { useEffect, useState } from 'react'
import './LeftPanelStyle.css'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send';
import { db } from '../db/firebase-config'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Zoom';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MiniProfileCard from './MiniProfileCard';
import RightPanel from './RightPanel';

function LeftPanel({ user, acesso }) {

  const messagesCollectionRef = collection(db, 'messages')
  const usersCollectionRef = collection(db, 'users')

  const [messages, setMessages] = useState([])
  const [messageValue, setMessageValue] = useState('')

  const [userLogado, setUserLogado] = useState(user)
  const [uExposed, setUExposed] = useState(userLogado)
  const [users, setUsers] = useState([])
  const [alertMessage, setAlertMessage] = useState(false)
  const [timer, setTimer] = useState(false)
  const [scene, setScene] = useState('')

  useEffect(() => {
    async function fetchData() {
      const data = await getDocs(messagesCollectionRef)

      setMessages(data.docs.map((message, k) => ({ ...message.data() })))
    }
    fetchData()


  }, [])
  //[timer]
  useEffect(() => {
    async function fetchData() {
      const data = await getDocs(usersCollectionRef)

      let arr = []
      data.docs.map((user, k) => {
        const u = {
          id: user.id,
          nome: user.data().nome,
          email: user.data().email,
          senha: user.data().senha,
          bio: user.data().bio,
          img: user.data().img
        }
        arr.push(u)
      })
      setUsers(arr)
    }
    fetchData()
  }, [timer])
  //[timer], [messageValue]
  function organizeMessages() {
    messages.sort(function (a, b) {
      if (a.hora._compareTo(b.hora) == 1) {
        return -1
      } else {
        return true
      }
    })
  }
  function autorName(mensagem) {
    return users.find(u => u.email === mensagem.autor)
  }

  async function sendMessage(e) {
    e.preventDefault()
    setMessageValue("")
    if (messageValue.trim().length === 0) {
      setMessageValue('')
      setAlertMessage(true)
      // setTimeout(() => {
      //   setAlertMessage(false)
      // }, 2000);
      return
    }


    const newMessage = {
      autor: userLogado.email,
      hora: new Date,
      valor: messageValue
    }

    await addDoc(messagesCollectionRef, newMessage)

  }

  function userExposed(uE) {
    setUExposed(uE)
    setScene("exposed")
  }

  function formatData(m) {
    return m.hora.toDate().getHours() + ":" + m.hora.toDate().getMinutes()
  }

  function exit() {
    acesso()
  }

  function goChat() {
    setScene('')
  }

  function goProfile() {
    setScene('profile')
  }

  return (

    <div className='left'>
      {scene !== "profile" && (
      <div className="chat-container">
        <div className="profile-friend">
          <h5 style={{ display: "none" }}>
            {organizeMessages()}
            {setTimeout(() => {
              setTimer(!timer)
            }, 5000)}
          </h5>
          
          <div className="card-perfil">
            <img className='picture-profile' src={uExposed.img} alt="perfil" />
            <div className="ballon-profile" style={{ flexDirection: "column" }}>
              <div className="nome" style={{ alignSelf: "flex-start" }}>
                <p style={{ float: "left" }}>Nome</p>
                <h1>{uExposed.nome}</h1>
              </div>
              <div className="bio" style={{ wordWrap: "break-word", color: "black" }}>
                <p style={{ alignSelf: "flex-start" }}>Biografia</p>
                <h3 style={{ wordBreak: "break-word" }} >{uExposed.bio ? uExposed.bio : "Este usuário não possui nenhuma Bio"}</h3>
              </div>
            </div>
          </div>
        </div>
        
          <div className="chat">
            <div className="navigation-group">
              <Fab variant="extended" color='error' size="medium" aria-label="add" onClick={exit}>
                <LogoutIcon />
                Sair
              </Fab>
              <Fab variant="extended" size="medium" aria-label="add" onClick={goProfile}>
                <AccountCircleIcon />
                Perfil
              </Fab>
            </div>
            {scene === "exposed" && (
              <MiniProfileCard user={uExposed} back={goChat} />
            )}
            <div className="view-messages">
              {!messages[0] && (
                <CircularProgress size={100} style={!messages[0] ? { alignSelf: "center" } : { alignSelf: "center", display: "none" }} />
              )}

              {alertMessage && (
                <Zoom in={alertMessage} style={{ transitionDelay: alertMessage ? '0ms' : '0ms' }}>
                  <Alert variant="filled" severity="error" Tran>
                    Digite o corpo da mensagem
                  </Alert>
                </Zoom>
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

            </div>
            <form className='form-chat' onSubmit={(e) => sendMessage(e)}>
              <div className="chat-input-group">
                <input onChange={(e) => setMessageValue(e.target.value)} value={messageValue} type="text" name="mensagem" className='menssage-input' />
                <IconButton onClick={sendMessage}>
                  <SendIcon fontSize='medium' style={{padding:"0px"}}></SendIcon>
                </IconButton>
              </div>
            </form>
          </div>
        


        
      </div>
      )}
      {scene === 'profile' && (
          <RightPanel className="right" user={userLogado} goBack={goChat}  />
        )}
    </div>
  )
}

export default LeftPanel