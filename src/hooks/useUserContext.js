import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

export const useUserContext = () => {
    const context = useContext(UserContext)

    if(context){
        return context
    }

    console.log(`Erro ao carregar contexto: ${context}`)

}