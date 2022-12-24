import { createContext, useState } from "react";

export const SceneContext = createContext()

export const SceneContextProvider = ({children}) => {

    const [scene, setScene] = useState("login")

    return (
        <SceneContext.Provider value={{scene, setScene}} >
            {children}
        </SceneContext.Provider>
    )
}