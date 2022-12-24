import { useContext } from "react";
import { SceneContext } from "../contexts/SceneContext";

export const useSceneContext = () => {
    const context = useContext(SceneContext)

    if(context){
        return context
    }

    console.log(`Erro ao carregar contexto: ${context}`)

}