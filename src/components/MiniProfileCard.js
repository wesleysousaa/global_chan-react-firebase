import React from 'react'
import './MiniProfileCardStyle.css'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Fab from '@mui/material/Fab';

function MiniProfileCard({ user, back }) {
    return (
        <div className='mini-profile-container'>
            <div className="itens">
                <img src={user.img} alt="foto-perfil" className='picture-profile-select' />
                <div className="group-name">
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
            <div className="nav">
                <Fab variant="extended" color='error' size="medium" onClick={back}>
                    <ArrowDropUpIcon />
                    Voltar
                </Fab>
            </div>
        </div>
    )
}

export default MiniProfileCard