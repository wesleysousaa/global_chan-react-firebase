import React, { useEffect, useState } from 'react'
import './MiniProfileCardStyle.css'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Fab from '@mui/material/Fab';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { collection, getDocs, } from 'firebase/firestore'
import { db } from '../db/firebase-config';

function MiniProfileCard({ theme, user, back, solicitations, invites, addUser, cancelSolicitation, acceptSolicitation, userLogado, deleteSolicitation }) {
    const solicitacoesCollectionRef = collection(db, 'solicitacoes')
    const usersCollenctionRef = collection(db, 'users')

    const [pedidosId, setPedidosId] = useState(invites)
    const [timer, setTimer] = useState(false)
    const [userLogadoA, setUserLogadoA] = useState(userLogado)
    const [userA, setUserA] = useState(user)

    useEffect(() => {
        async function fetchData() {
            const data = await getDocs(usersCollenctionRef)

            data.docs.map((u, k) => {
                const us = {
                    id: u.id,
                    nome: u.data().nome,
                    email: u.data().email,
                    senha: u.data().senha,
                    bio: u.data().bio,
                    img: u.data().img,
                    amigos: u.data().amigos ? u.data().amigos : []
                }
                if (us.id === userLogado.id) {
                    setUserLogadoA(us)
                }
                if (us.id === user.id) {
                    setUserA(us)
                }
            })
        }

        fetchData()
    }, [timer])

    useEffect(() => {
        async function fetchData() {
            const data = await getDocs(solicitacoesCollectionRef)

            let arr = []
            data.docs.map((s, k) => {
                const sol = {
                    id: s.id,
                    origem: s.data().origem,
                    destino: s.data().destino,
                }
                if (sol.destino === userLogado.id) {
                    arr.push(sol.origem)
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