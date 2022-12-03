import React from 'react'
import './CardFriendStyle.css'

// MUI Features
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Fab from '@mui/material/Fab';

function CardFriend({amigo, removeUser}) {

    return (
        <div className='friend'>
            <img src={amigo.img} className='mini-picture' alt="Foto-amigo" />
            <h4 style={{margin:'1em'}}>{amigo.nome}</h4>
            <Fab variant="circular" color='error' size="small" onClick={() => removeUser(amigo)}>
                <PersonRemoveIcon />
            </Fab>
        </div>
    )
}

export default CardFriend