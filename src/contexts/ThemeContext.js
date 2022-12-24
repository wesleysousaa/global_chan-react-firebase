import { createContext, useState } from "react";

export const ThemeContext = createContext()

export const ThemeContextProvider = ({children}) => {

    const [theme, setTheme] = useState(false)

    return (
        <ThemeContext.Provider value={{theme, setTheme}} >
            {children}
        </ThemeContext.Provider>
    )
}