import { createContext, useState, useEffect } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

export interface AuthUser {
    user_id: string
    first_name: string
    email?: string
    token: string
    refresh_token?: string
    [key: string]: unknown
}

export interface AuthContextType {
    auth: AuthUser | null
    setAuth: Dispatch<SetStateAction<AuthUser | null>>
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => {},
    loading: true,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const parseUser = JSON.parse(storedUser)
                setAuth(parseUser)
            }
        } catch (error) {
            console.error('Failed to parse user', error)
        } finally {
            setLoading(false)
        }
    }, [])
    
    useEffect(() => {
        if (auth) {
            localStorage.setItem('user', JSON.stringify(auth))
        } else {
            localStorage.removeItem('user')
        }
    }, [auth])
    
    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext