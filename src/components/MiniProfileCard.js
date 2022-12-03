import React, { useEffect, useState } from 'react'
import './MiniProfileCardStyle.css'

//MUI Features
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Fab from '@mui/material/Fab';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// Services
import FetchUsers from '../services/FetchUsers'
import FetchSolicitations from '../services/FetchSolicitations'

function MiniProfileCard({ theme, user, back, solicitations, invites, addUser, cancelSolicitation, acceptSolicitation, userLogado, deleteSolicitation }) {

    const [pedidosId, setPedidosId] = useState(invites)
    const [timer, setTimer] = useState(false)
    const [userLogadoA, setUserLogadoA] = useState(userLogado)
    const [userA, setUserA] = useState(user)

    useEffect(() => {
        async function fetchData() {
            const data = await FetchUsers()

            setUserLogadoA(data.filter(u => u.id === userLogado.id)[0])
            setUserA(data.filter(u => u.id === user.id)[0])
        }

        fetchData()
    }, [timer])

    useEffect(() => {
        async function fetchData() {
            const data = await FetchSolicitations()

            let arr = []
            
            data.map((s, k) => {
                if (s.destino === userLogado.id) {
                    arr.push(s.origem)
                }
            })

            setPedidosId(arr)
        }
        fetchData()
    }, [timer])

    return (
        <div className='mini-profile-container' >
            <div style={{ display: "none" }}>
                {setTimeout(() => {
                    setTimer(!timer)
                }, 5000)}
            </div>
            <div className="itens" style={theme ? {color:"white"} : {color:"black"}}>
                <div className='info-profile'>
                    <div className="img-name-bio" >
                        <img src={user.img} alt="foto-perfil" className='picture-profile-select' />
                        <div className="group-name" >
                            <span>
                                <p style={{ justifyContent: "start" }}>Nome</p>
                                <h2 className='name'>{user.nome}</h2>
                            </span>
                            <span>
                                <p style={{ justifyContent: "start" }}>Biografia</p>
                                <h3>{user.bio ? user.bio : "Este usuário não possui nenhuma Bio"}</h3>
                            </span>
                        </div>
                    </div>

                    {userLogadoA.amigos.includes(user.id) && (
                        <div className='amigos' style={theme ? {backgroundColor:"#ed6c02", color:"white"} : {}}>
                            <PeopleAltIcon />
                            Amigo
                        </div>
                    )}
                </div>
                {pedidosId.includes(user.id) ? (
                    <div className='bts-invitation' style={{ display: 'flex' }}>
                        <Fab style={{ marginRight: "0.3em" }} variant="extended" color='success' size="medium" onClick={() => acceptSolicitation(user)}>
                            Aceitar
                            <PersonAddAlt1Icon />
                        </Fab>
                        <Fab variant="extended" color='error' size="medium" onClick={() => cancelSolicitation(user)}>
                            Recusar
                            <PersonRemoveIcon />
                        </Fab>
                    </div>
                ) : (
                    <div className="add-recuse">
                        {!(userLogadoA.amigos.includes(user.id)) && !(userLogadoA.id === user.id) && (
                            solicitations.includes(user.id) ? (
                                <Fab variant="extended" color='error' size="medium" onClick={() => deleteSolicitation(user)}>
                                    Cancelar Solicitação
                                    <PersonRemoveIcon />
                                </Fab>
                            ) : (
                                <Fab variant="extended" color='success' size="medium" onClick={() => addUser(user.id)}>
                                    Adicionar aos amigos
                                    <PersonAddAlt1Icon />
                                </Fab>
                            )
                        )
                        }
                    </div>
                )}
            </div>

            <div className="nav">
                <Fab variant="extended" color='error' size="medium" onClick={back}>
                    <ArrowDropUpIcon />
                    Voltar
                </Fab>
            </div>
        </div >
    )
}

export default MiniProfileCard