import { useEffect, useState } from 'react';
import './App.css';
import RegisterUser from './services/RegisterUser';
import FetchUsers from './services/FetchUsers'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  
  const [theme, setTheme] = useState(false)

  const [newEmail, setNewEmail] = useState("")
  const [newSenha, setNewSenha] = useState("")
  const [newNome, setNewNome] = useState("")
  const [newBio, setNewBio] = useState("")

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [nome, setNome] = useState("")

  const [mensagemLogin, setMensagemLogin] = useState("")
  const [mensagemCadastro, setMensagemCadastro] = useState("")

  const [emails, setEmails] = useState([])
  const [users, setUsers] = useState([])
  const [userLogado, setUserLogado] = useState()
  const [scene, setScene] = useState("login")

  const [recent, setRecent] = useState(false)


  useEffect(() => {
    async function fetchData() {
      setUsers(await FetchUsers())
      let arr = []
      await users.forEach(u => {
        arr.push(u.email)
      })
      setEmails(arr)
    }
    fetchData()
  }, [userLogado], [scene])

  function handleLogin(e) {
    e.preventDefault()

    if(email.trim() === "" || senha.trim() === ""){
      setMensagemLogin("Campos Obrigatórios")
    }

    users.forEach(u => {
      if (email === u.email) {
        setMensagemLogin('')
        if (senha === u.senha) {
          setUserLogado(u)
          setMensagemLogin('')
          setScene('register')
          return
        } else {
          setMensagemLogin('Senha inválida')
          return
        }
      }
      setMensagemLogin('Email não existe')
    })
    
  }
  
  async function handleCadastro(e) {
    e.preventDefault()
    if (newNome.trim().length === 0 || newEmail.trim().length === 0 || newSenha.trim().length === 0 || newBio.trim().length === 0) {
      setMensagemCadastro('Campo obrigatório')
      return
    }

    if (newSenha.length < 8) {
      setMensagemCadastro('Senha deve conter pelomenos 8 caracteres')
      return
    }

    if (emails.includes(newEmail)) {
      setMensagemCadastro('Email já cadastrado')
      return
    }

    const newUser = {
      email: newEmail,
      nome: newNome,
      senha: newSenha,
      bio: newBio,
      img: "https://firebasestorage.googleapis.com/v0/b/chanproject-f6e42.appspot.com/o/images-profile%2Fdefault-user.png?alt=media&token=e9d896cc-bcfd-4d18-9fdc-f3ead380cc18"
    }

    await RegisterUser(newUser)
    setRecent(!recent)
    setUserLogado(newUser)
    
    window.location.reload(false);
  }

  function changeScene() {
    setUserLogado()
    const sceneString = scene === 'register' ? 'login' : 'register'
    setNome('')
    setEmail('')
    setSenha('')
    setScene(sceneString)
    setMensagemLogin('')
    setMensagemCadastro('')
  }

  function refreshUser(u){
    setUserLogado(u)
  }

  function uploadTheme(t) {
    setTheme(t)
  }

  return (
    <div className="m" style={!users ? {display: "flex", alignItems:"center", justifyContent:"center"} : {}}>
      {!users && (
          <CircularProgress size={200} />
      )}

      {users && (
        userLogado ? (
          <div className="App">
            <LeftPanel  className="left" uploadTheme={uploadTheme} user={userLogado} acesso={changeScene} />
            <RightPanel className="right"  theme={theme} user={userLogado} acesso={changeScene} users={users} userUpadated={refreshUser}/>
          </div>
        ):(
            scene === "login" ? (
              <div className="login-register">
                <form onSubmit={(e) => handleLogin(e)} className="forms">
                  <h1>Login</h1>
                  <h2 style={{ color: "red" }}>{mensagemLogin}</h2>
                  <label className="labels">
                    Email
                    <input value={email} style={mensagemLogin === "Email não existe" || mensagemLogin === "Campos Obrigatórios" && email.trim() === "" ? { color: "red", borderColor: "red" } : {}} className="inputs" placeholder="fulano@gmail.com" type="text" onChange={(e) => setEmail(e.target.value)} />
                  </label>
                  <label className="labels">
                    Senha
                    <input value={senha} style={mensagemLogin === "Senha inválida" || mensagemLogin === "Campos Obrigatórios" && senha.trim() === "" ? { color: "red", borderColor: "red" } : {}} className="inputs" type="password" name="Senha" onChange={(e) => setSenha(e.target.value)} />
                  </label>
                  <input type="submit" value="Entrar" className="confirm-button" />
                </form>
                <button className='bt-cadastrar' onClick={changeScene}>Ainda não tem conta? clique aqui!</button>
              </div>
            ):(
                <div className="login-register">
                  <form className="forms" onSubmit={(e) => handleCadastro(e)}>
                    <h1>Registro</h1>
                    <h2 style={{ color: "red" }}>{mensagemCadastro}</h2>
                    <label className="labels">
                      Nome
                      <input maxLength={12} value={newNome} style={mensagemCadastro === "Campo obrigatório" && newNome.trim().length === 0 ? { color: "red", borderColor: "red" } : {}} className="inputs" type="text" onChange={(e) => setNewNome(e.target.value)} />
                    </label>
                    <label className="labels">
                      Email
                      <input value={newEmail} style={(newEmail.trim().length === 0) && (mensagemCadastro === "Campo obrigatório") || (mensagemCadastro === "Email já cadastrado") ? { color: "red", borderColor: "red" } : {}} className="inputs" placeholder="fulano@gmail.com" type="text" onChange={(e) => setNewEmail(e.target.value)} />
                    </label>
                    <label className="labels">
                      Senha
                      <input value={newSenha} style={(newSenha.trim().length === 0) && (mensagemCadastro !== "") ? { color: "red", borderColor: "red" } : {}} className="inputs" type="password" name="Senha" onChange={(e) => setNewSenha(e.target.value)} />
                    </label>
                    <label className="labels">
                      Biografia
                      <input maxLength={50} value={newBio} style={(newBio.trim().length === 0) && (mensagemCadastro === "Campo obrigatório") ? { color: "red", borderColor: "red" } : {}} className="inputs" type="text" name="Senha" onChange={(e) => setNewBio(e.target.value)} />
                    </label>
                    <div className="bts">
                      <input type="button" value="Voltar" className="cancel-button" onClick={changeScene} />
                      <input type="submit" value="Cadastrar" className="confirm-button" />
                    </div>
                  </form>
                </div>
              )
          )
      )}
    </div>
  );
}

export default App;
