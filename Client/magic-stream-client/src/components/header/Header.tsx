import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useNavigate, NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import logo from '../../assets/hero.png'

type HeaderProps = {
    handleLogout: () => void
}

const Header = ({handleLogout}: HeaderProps) => {
    const navigate = useNavigate()
    const { auth } = useAuth()
    return (
        <Navbar className='shadow-sm' bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>
                    <img 
                        src={logo} 
                        alt="Logo" 
                        width='30'
                        height='30'
                        className='d-inline-block align-top me-2'
                    />
                    Magic Stream
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/recommended">
                            Recommended
                        </Nav.Link>
                    </Nav>

                    <Nav className='ms-auto align-items-center'>
                        {auth ? (
                            <>
                                <span className='text-light me-3'>Hello, {auth.first_name}</span>
                                <Button variant="outline-info" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    className="me-2" 
                                    variant="outline-info" 
                                    size="sm" 
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>

                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header