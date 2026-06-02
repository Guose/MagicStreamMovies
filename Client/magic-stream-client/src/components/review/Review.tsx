import { Form, Button } from 'react-bootstrap'
import { useRef, useState, useEffect, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import Movie from '../movie/Movie'
import Spinner from '../spinner/Spinner'
import type { MovieModel } from '../../models/movieModel'

const Review = () => {
    const [movie, setMovie] = useState<MovieModel | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { imdbId } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useAuth()
    const reviewRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const fetchMovie = async () => {
            setIsLoading(true)
            try {
                const response = await axiosPrivate.get(`/movie/${imdbId}`)
                setMovie(response.data)
            } catch (err) {
                console.error('Failed to fetch movie details.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchMovie()
    }, [imdbId, axiosPrivate])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setIsLoading(true)
        try {
            const response =await axiosPrivate.post(`/reviews/${imdbId}`, { admin_review: reviewRef.current })

            setMovie((prevMovie) => {
                if (!prevMovie) return null
                return {
                    ...prevMovie,
                    admin_review: response.data?.admin_review ?? prevMovie.admin_review,
                    ranking: {
                        ...prevMovie.ranking,
                        ranking_name: response.data?.ranking_name ?? prevMovie.ranking?.ranking_name
                    }
                }
            })
        } catch (err) {
            console.error('Failed to submit review.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className='container py-5'>
                    <h2 className='text-center mb-4'>Admin Review</h2>
                    <div className='row justify-content-center'>
                        <div className='col-12 col-md-6 d-flex align-items-center justify-content-center mb-4 mb-md-0'>
                            <div className='w-100 shadow rounded p-3 bg-white d-flex justify-content-center align-items-center'>
                                <Movie movie={movie} />
                            </div>
                        </div>
                        <div className='col-12 col-md-6 d-flex align-items-stretch'>
                            <div className='w-100 shadow rounded p-4 bg-light'>
                                {auth && auth.role === 'ADMIN' ? (
                                    <Form onSubmit={handleSubmit} >
                                        <Form.Group className='mb-3' controlId='adminReviewTextarea'>
                                            <Form.Label>Admin Review</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                rows={8}
                                                ref={reviewRef}
                                                defaultValue={movie?.admin_review}
                                                placeholder='Write your review here...'
                                                style={{ resize: 'vertical' }}
                                            />
                                        </Form.Group>
                                        <div className='d-flex justify-content-end'>
                                            <Button variant='info' type='submit'>
                                                Submit Review
                                            </Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <div className='alert alert-info'>{movie?.admin_review}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Review