import { createContext , useContext, useEffect , useState } from "react";
import { getCurrentLoggedInInstituteService } from "../service/Institute.service";

const InstituteAuthContext = createContext();

export const InstituteAuthProvider =  ({children}) => {
    const [isLoggedIn , setIsLoggedIn ] = useState(false);
    const [instituteInfo , setInstituteInfo ] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => { 
            try{
                const institute = await getCurrentLoggedInInstituteService();
                if(institute) {
                    setIsLoggedIn(true)
                    setInstituteInfo(institute)
                }
            } catch(e) {
                console.log('no institute logged in')
                setIsLoggedIn(false)
                setInstituteInfo(null)
            } finally {
                setLoading(false); 
            }
        };

        checkLoginStatus();
    }, []);

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
        setInstituteInfo(userData);
    }

    const handleLogOut = () => {
        setIsLoggedIn(false);
        setInstituteInfo(null);
        setLoading(false); 

    }

    return (
        <InstituteAuthContext.Provider value={{
            setIsLoggedIn,
            setInstituteInfo,
            isLoggedIn,
            instituteInfo,
            loading,
            handleLoginSuccess,
            handleLogOut
        }}>
            {children}
        </InstituteAuthContext.Provider>
    )
} 

export const useInstituteAuth = () => useContext(InstituteAuthContext);
