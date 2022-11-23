import React, {  useState } from 'react';
import './RightPanelStyle.css';
import { db } from '../db/firebase-config';
import { doc, updateDoc } from "firebase/firestore";
import Alert from '@mui/material/Alert';
import Zoom from '@mui/material/Zoom';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function RightPanel({ user, acesso, goBack }) {
  const storage = getStorage()

  const [scene, setScene] = useState("home")
  const [mensagem, setMensagem] = useState('')

  const [nome, setNome] = useState(user.nome)
  const [senha, setSenha] = useState(user.senha)
  const [email, setEmail] = useState(user.email)
  const [bio, setBio] = useState(user.bio)
  const [img, setImg] = useState()
  const [imgURL, setImgURL] = useState(user.img)
  const [id, setId] = useState(user.id)


  const [alertTime, setAlertTime] = useState(false)

  function changeScene() {
    setScene(scene === 'home' ? 'change' : 'home')
  }

  async function updateUser(e) {
    e.preventDefault()

    const urlImg = await uploadImage()

    const userUpadated = {
      nome,
      senha,
      email,
      img: urlImg,
      bio
    }

    console.log("segundo do user: " + userUpadated.img);

    if (nome.trim().length === 0) {
      setMensagem("Campo obrigatório")
      return
    }

    if (senha.trim().length < 8) {
      setMensagem("Senha deve conter pelomenos 8 caracteres")
      return
    }

    const userDoc = doc(db, 'users', user.id)

    await updateDoc(userDoc, userUpadated).then((e) => {
      console.log("terceiro persistiu");
    })
    setMensagem("")
    setAlertTime(true)

    await setTimeout(() => {
      setAlertTime(false)
    }, 2000);

  }

  function exit() {
    acesso()
  }

  async function uploadImage() {

    if (img) {
      const imageRef = ref(storage, "images-profile/" + id)

      await uploadBytes(imageRef, img).then((snapshot) => {
        console.log("primeiro Sucesso");
      })

      const url = await getDownloadURL(imageRef).then((url) => {
        return url
      })

      setImgURL(url)
      return url
    }
    return user.img
  }


  return (
    <div className={acesso ? "right" : "right-smartphone"}>
      {scene === 'home' && (
        <div className="profile">
          <h1 style={{ borderBottom: "solid 5px black" }}>Meu Perfil</h1>
          <div className="img_name" onClick={changeScene}>
            <img src={imgURL} alt="Perfil" className='img' />
            <div className="ballon-profile">
              <div className="nome">
                <p style={{ float: "left" }}>Nome</p>
                <h1>{nome}</h1>
              </div>
              <div className="bio">
                <p style={{ alignSelf: "flex-start" }}>Biografia</p>
                <h3 style={{ wordBreak: "break-word" }}>{bio}</h3>
              </div>
            </div>

          </div>
          {acesso && (
            <button className='cancel-button' onClick={exit}>Sair</button>
          )}
          {!acesso && (
            <button className='cancel-button' onClick={goBack}>Voltar</button>
          )}

        </div>
      )}
      {scene === 'change' && (
        <div className="login-register" style={{ backgroundImage: 'none' }}>

          <Zoom in={alertTime} style={{ transitionDelay: alertTime ? '0ms' : '500ms' }}>
            <Alert variant="filled" severity="success" Tran>
              Dados alterados com Sucesso
            </Alert>
          </Zoom>

          <form className="forms" onSubmit={(e) => updateUser(e)} >
            <h1 style={{ marginBottom: "0px" }}>Alterar dados</h1>
            <h2 style={mensagem === "Sucesso!" ? { color: "green" } : { color: "red" }}>{mensagem}</h2>
            <label className='labels'>
              Imagem
              <input className='confirm-button' onChange={(e) => setImg(e.target.files[0])} type="file" accept='image/*' name="foto" style={{ width: "20em" }} />
            </label>

            <label className="labels">
              Nome
              <input value={nome} style={mensagem === "Campo obrigatório" ? { color: "red", borderColor: "red" } : {}} className="inputs" type="text" onChange={(e) => setNome(e.target.value)} />
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
              <input value={bio} style={bio.trim().length === 0 && mensagem === "Campo obrigatório" ? { color: "red", borderColor: "red" } : {}} className="inputs" type="text" name="Senha" onChange={(e) => setBio(e.target.value)} />
            </label>
            <div className="bts">
              <input type="button" value="Voltar" className="cancel-button" onClick={changeScene} />
              <input type="submit" value="Salvar" className="confirm-button" />
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

export default RightPanel