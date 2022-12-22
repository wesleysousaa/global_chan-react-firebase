import { createContext, useState } from "react";

export const UserContext = createContext()

export const UserContextProvider = ({children}) => {

    const [userLogado, setUserLogado] = useState()

    return (
        <UserContext.Provider value={{userLogado, setUserLogado}} >
            {children}
        </UserContext.Provider>
    )
}