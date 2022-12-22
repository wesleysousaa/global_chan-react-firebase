import { useContext } from "react"
import { UsersContext } from "../contexts/UsersContext"

export const useUsersContext = () => {
    const context = useContext(UsersContext)

    if(context){
        return context
    }

    console.log(`Erro ao carregar contexto: ${context}`)

}