// import Button from 'react-bootstrap/Button'
import { type MovieModel } from '../../models/movieModel'

type Props = {
    movie: MovieModel
}

const Movie = ({ movie } : Props) => {
    
    return (
        <div className='col-md-4 mb-4'>
            <div className="card h-100 shadow-sm">
                <div style={{ position: 'relative' }}>
                    <img 
                        src={movie.poster_path} 
                        className="card-img-top" 
                        alt={movie.title} 
                        style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '250px'
                        }}
                    />                
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text mb-2">{movie.imdb_id}</p>                    
                </div>
                {movie.ranking?.ranking_name && (
                    <span className='badge bg-dark m-3 p-2' style={{ fontSize:"1rem" }}>
                        {movie.ranking.ranking_name}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Movie