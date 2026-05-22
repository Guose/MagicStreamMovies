import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useNavigate, NavLink, Link } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
    const [auth, setAuth] = useState(false)

    const register = () => {
        setAuth(true)
        navigate('/register')
    }

    const login = () => {
        setAuth(true)
        navigate('/login')
    }

    const logout = () => {
        setAuth(false)
        navigate('/logout')
    }

    return (
        <Navbar className='shadow-sm' bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Magic Stream</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/recommended">Recommended</Nav.Link>
                    </Nav>
                    <Nav className='ms-auto align-items-center'>
                        {auth ? (
                            <Button variant="outline-light" size="sm" onClick={logout}>Logout</Button>
                        ) : (
                            <>
                                <Button className="me-2" variant="outline-info" size="sm" onClick={login}>Login</Button>
                                <Button variant="info" size="sm" onClick={register}>Register</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header