import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axiosClient from '../../api/axiosConfig'
import logo from '../../assets/hero.png'
import type { Genre } from '../../models/genre'


// registered$ Placeholder#. This one is not the real one: spectrum

const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [favouriteGenres, setFavouriteGenres] = useState<Genre[]>([])
    const [genres, setGenres] = useState<Genre[]>([])

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const nav = useNavigate()

    const handleGenreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions)
        setFavouriteGenres(options.map(opt => ({
            genre_id: Number(opt.value),
            genre_name: opt.label
        })))        
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const defaultRole = 'USER'

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role: defaultRole,
                favourite_genres: favouriteGenres,
            }

            const response = await axiosClient.post('/register', payload)
            if (response.data.error) {
                setError(response.data.error)
                return
            }

            nav('/login', { replace: true })
        } catch (error) {
            console.error('Error registering user:', error)
            setError('Failed to register user')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axiosClient.get('/genres')
                if (response.data.length === 0) {
                    console.log('No genres found in the database.')
                }
                setGenres(response.data)
            } catch (error) {
                console.error('Error fetching genres:', error)
            }
        }
        fetchGenres()
    }, [])

    return (
        <Container className="login-container d-flex align-items-center justify-content-center min-vh-100" >
            <div className='login-card shadow p-4 rounded bg-white' style={{ maxWidth: 400, width: '100%'}}>
                <div className='text-center mb-4'>
                    <img src={logo} alt="Logo" className='mb-2' width={60} />
                    <h2 className='fw-bold'>Register</h2>
                    <p className='text-muted'>Create your account</p>
                    {error && <div className="alert alert-danger">{error}</div>}
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        {/* <Form.Label>First Name</Form.Label> */}
                        <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        {/* <Form.Label>Last Name</Form.Label> */}
                        <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        {/* <Form.Label>Email</Form.Label> */}
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        {/* <Form.Label>Password</Form.Label> */}
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        {/* <Form.Label>Confirm Password</Form.Label> */}
                        <Form.Control
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Passwords do not match.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Select
                            multiple
                            value={favouriteGenres.map(genre => genre.genre_id.toString())}
                            onChange={handleGenreChange}
                        >
                            {genres.map((genre) => (
                                <option key={genre.genre_id} value={genre.genre_id} label={genre.genre_name}>
                                    {genre.genre_name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.
                        </Form.Text>
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-3"
                        disabled={loading}
                        style={{ fontWeight: 600, letterSpacing: 1 }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Registering...
                            </>
                        ) : 'Register' }
                    </Button>
                </Form>
            </div>
        </Container>
    )
}

export default Register