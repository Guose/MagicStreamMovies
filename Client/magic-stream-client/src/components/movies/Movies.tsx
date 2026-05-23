import Movie from '../movie/Movie'
import type { MovieModel } from '../../models/movieModel'

type Props = {
    movies: MovieModel[],
    message: string
}

const Movies = ({ movies, message}: Props) => {
    const movieList = Array.isArray(movies) ? movies : []
    
    return (
        <div className="container mt-4">
            {movieList && movieList.length > 0 ? (
                <div className="row">
                    {movieList.map((movie) => (
                        <Movie key={movie._id} movie={movie} />
                    ))}
                </div>
            ) : (
                <h2>{message}</h2>
            )}
        </div>
    )
}

export default Movies