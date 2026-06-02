import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'
import Movies from '../movies/Movies'
import Spinner from '../spinner/Spinner'

const Recommended = () => {
    const [movies, setMovies] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState('')
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            setIsLoading(true)
            setMessage('')
            try {
                const response = await axiosPrivate.get('/recommendedmovies')
                console.log('Recommended movies response:', response.data)
                setMovies(response.data)
            } catch (err) {
                setMessage('Failed to fetch recommended movies.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchRecommendedMovies()
    }, [])

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <Movies movies={movies} message={message} />
            )}
        </>
    )
}

export default Recommended