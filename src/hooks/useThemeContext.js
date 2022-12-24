import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export const useThemeContext = () => {
    const context = useContext(ThemeContext)

    if(context){
        return context
    }

    console.log(`Erro ao carregar contexto: ${context}`)

}