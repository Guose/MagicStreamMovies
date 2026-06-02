import { useState, useEffect } from "react"
import axiosClient from "../../api/axiosConfig"
import Movies from '../movies/Movies'
import type { MovieModel } from "../../models/movieModel"

type HomeProps = {
    updateMovieReview: (imdb_id: string) => void
}

const Home = ({ updateMovieReview }: HomeProps) => {
    const [movies, setMovies] = useState<MovieModel[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('Loading...')

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true)
            try {
                const response = await axiosClient.get('/movies')
                setMovies(response.data)

                if (response.data.length === 0) {
                    setMessage('There are currently no movies available')
                }
            } catch (error) {
                setMessage('Failed to fetch movies')
                console.error('Error fetching movies:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [])

    return(
        <div className="home">
            {loading ? (
                <h2>{message}</h2>
            ) : (
                <Movies movies={movies} message={message} updateMovieReview={updateMovieReview} />
            )}
        </div>
    )
}

export default Home