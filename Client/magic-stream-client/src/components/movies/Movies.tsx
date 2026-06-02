import Movie from '../movie/Movie'
import type { MovieModel } from '../../models/movieModel'

type Props = {
    movies: MovieModel[],
    message: string,
    updateMovieReview?: (imdbId: string) => void
}

const Movies = ({ movies, message, updateMovieReview }: Props) => {
    const movieList = Array.isArray(movies) ? movies : []
    
    return (
        <div className="container mt-4">
            <div className="row">
                {movieList && movieList.length > 0 ? (
                    movieList.map((movie) => (
                        <Movie 
                            key={movie._id} 
                            movie={movie} 
                            updateMovieReview={updateMovieReview} 
                        />
                    ))
                ) : (
                    <h2>{message}</h2>
                )
                }
            </div>
        </div>
    )
}

export default Movies