import React, { useState, useEffect } from 'react';
import './RightPanelStyle.css';

// MUI features
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Zoom';

// Outros componentes
import CardFriends from './CardsFriends';

// Services
import UpdateUser from '../services/UpdateUser'
import UploadImage from '../services/UploadImage'

function RightPanel({ theme , user, acesso, goBack, users}) {

  const [scene, setScene] = useState("home")
  const [mensagem, setMensagem] = useState('')

  const [userUp, setUserUp] = useState(user)
  const [nome, setNome] = useState(user.nome)
  const [senha, setSenha] = useState(user.senha)
  const [email, setEmail] = useState(user.email)
  const [bio, setBio] = useState(user.bio)
  const [img, setImg] = useState()
  const [amigos, setAmigos] = useState(user.amigos)

  const [imgURL, setImgURL] = useState(user.img)
  const [id, setId] = useState(user.id)

  const [alertTime, setAlertTime] = useState(false)

  function changeScene(sceneC) {
    setScene(sceneC)
  }

  async function updateUser(e) {
    e.preventDefault()

    const urlImg = await uploadImage()

    const userUpadated = {
      nome,
      senha,
      email,
      img: urlImg,
      bio,
      amigos
    }

    if (nome.trim().length === 0) {
      setMensagem("Campo obrigatório")
      return
    }

    if (senha.trim().length < 8) {
      setMensagem("Senha deve conter pelomenos 8 caracteres")
      return
    }
    await UpdateUser(userUp.id, userUpadated)

    setMensagem("")
    setAlertTime(true)

    await setTimeout(() => {
      setAlertTime(false)
    }, 2000);

    userUpadated.id = userUp.id
    setUserUp(userUpadated)
  }

  function exit() {
    acesso()
  }

  async function uploadImage() {
    if (img) {
      const url = await UploadImage(img, id)
      setImgURL(url)
      return imgURL
    }
    return user.img
  }

  return (
    <div className={acesso ? "right" : "right-smartphone"}>
      {scene === 'home' && (
        <div className="profile">
          <h1 style={{ borderBottom: "solid 5px black" }}>Meu Perfil</h1>
          <div className="img_name" onClick={() => changeScene('update')}>
            <img src={userUp.img} alt="Perfil" className='img' />
            <div className="ballon-profile">
              <div className="nome">
                <p style={{ float: "left" }}>Nome</p>
                <h1>{userUp.nome}</h1>
              </div>
              <div className="bio">
                <p style={{ alignSelf: "flex-start" }}>Biografia</p>
                <h3 style={{ wordBreak: "break-word" }}>{userUp.bio}</h3>
              </div>
            </div>

          </div>
          {acesso && (
            <div className='bts-profile'>
              <button className='confirm-button' onClick={() => changeScene('friends')}>Amigos</button>
              <button className='cancel-button' onClick={exit}>Sair</button>
            </div>
          )}
          {!acesso && (
            <button className='cancel-button' onClick={goBack}>Voltar</button>
          )}

        </div>
      )}
      {scene === 'update' && (
        <div className="login-register" style={{ backgroundImage: 'none' }}>

          <Zoom in={alertTime} style={{ transitionDelay: alertTime ? '0ms' : '500ms' }}>
            <Alert variant="filled" severity="success" Tran>
              Dados alterados com Sucesso
            </Alert>
          </Zoom>
          <form className="forms" onSubmit={(e) => updateUser(e)} style={theme ? {backgroundColor:"rgba(50, 49, 49, 0.413)", backgroundImage:"none", color:"white"} : {}}>
            <h1 style={{ marginBottom: "0px" }}>Alterar dados</h1>
            <h2 style={mensagem === "Sucesso!" ? { color: "green" } : { color: "red" }}>{mensagem}</h2>
            <label className='labels'>
              Imagem
              <input className='confirm-button' onChange={(e) => setImg(e.target.files[0])} type="file" accept='image/*' name="foto" style={{ width: "20em" }} />
            </label>
            <label className="labels">
              Nome
              <input maxLength={12} value={nome} style={mensagem === "Campo obrigatório" ? { color: "red", borderColor: "red" } : {}} className="inputs" type="text" onChange={(e) => setNome(e.target.value)} />
            </label>
            <label className="labels">
              Email
              <input value={email} disabled className="inputs" type="text" onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="labels">
              Senha
              <input value={senha} style={mensagem !== "" || mensagem === "Senha deve conter pelomenos 8 caracteres" ? { color: "red", mensagem: "red" } : {}} className="inputs" type="password" name="Senha" onChange={(e) => setSenha(e.target.value)} />
            </label>
            <label className="labels">
              Biografia
              <input  maxLength={50} value={bio} style={bio.trim().length === 0 && mensagem === "Campo obrigatório" ? { color: "red", borderColor: "red" } : {}} className="inputs" type="text" name="Senha" onChange={(e) => setBio(e.target.value)} />
            </label>
            <div className="bts">
              <input type="button" value="Voltar" className="cancel-button" onClick={() => changeScene("home")} />
              <input type="submit" value="Salvar" className="confirm-button" />
            </div>
          </form>
        </div>
      )}
      {scene === 'friends' && (

        <CardFriends changeScene={changeScene} userLogado={user} users={users}/>

      )}

    </div>
  )
}

export default RightPanel