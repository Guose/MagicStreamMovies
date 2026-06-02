import { useEffect } from 'react'
import axios from 'axios'
import useAuth from './useAuth'

const apiUrl = import.meta.env.VITE_API_BASE_URL

const useAxiosPrivate = () => {
    const axiosAuth = axios.create({
        baseURL: apiUrl,
        withCredentials: true,
    })

    const { auth, setAuth } = useAuth()

    let isRefreshing = false
    let failedQueue: Array<{ resolve: (value: string | null) => void; reject: (reason?: unknown) => void }> = []

    const processQueue = (error: unknown, token: string | null = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error)
            } else {
                prom.resolve(token)
            }
        })
        failedQueue = []
    }

    useEffect(() => {
        const requestInterceptor = axiosAuth.interceptors.request.use(
            config => {
                if (auth?.token && !config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth.token}`
                }
                return config
            },
            error => Promise.reject(error)
        )

        const responseInterceptor = axiosAuth.interceptors.response.use(
            response => response,
            async error => {
                console.log('⚠ Interceptor caught error:', error)
                const originalRequest = error.config

                if (originalRequest.url.includes('/refresh') && error.response?.status === 401) {
                    console.error('❌ Refresh token has expired or is invalid.')
                    localStorage.removeItem('user')
                    setAuth(null)
                    return Promise.reject(error)
                }

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise<string | null>((resolve, reject) => {
                            failedQueue.push({ resolve, reject })
                        })
                        .then(token => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`
                            return axiosAuth(originalRequest)
                        })
                        .catch(err => Promise.reject(err))
                    }

                    originalRequest._retry = true
                    isRefreshing = true

                    return new Promise((resolve, reject) => {
                        axiosAuth
                        .post('/refresh')
                        .then(response => {
                            const newToken: string = response.data.token
                            setAuth(prev => prev ? { ...prev, token: newToken } : prev)
                            processQueue(null, newToken)
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                            axiosAuth(originalRequest)
                                .then(resolve)
                                .catch(err => reject(err))
                        })
                        .catch(refreshError => {
                            processQueue(refreshError, null)
                            localStorage.removeItem('user')
                            setAuth(null)
                            reject(refreshError)
                        })
                        .finally(() => {
                            isRefreshing = false
                        })
                    })
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosAuth.interceptors.request.eject(requestInterceptor)
            axiosAuth.interceptors.response.eject(responseInterceptor)
        }
    }, [auth])

    return axiosAuth
}

export default useAxiosPrivate