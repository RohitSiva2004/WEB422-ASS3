import Link from 'next/link';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { readToken, removeToken } from '@/lib/authenticate';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function MainNav() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const rawToken = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
        console.log("MainNav: Raw token from localStorage:", rawToken ? "exists" : "null");
        
        const authToken = readToken();
        console.log("MainNav: Checking auth, token:", authToken ? "exists" : "null");
        console.log("MainNav: Username:", authToken?.userName);
        console.log("MainNav: Full token object:", authToken);
        setToken(authToken);
        setUserName(authToken?.userName || null);
      } catch (err) {
        console.error("MainNav: Error reading token:", err);
        setToken(null);
        setUserName(null);
      }
    };

    checkAuth();
    
    const timeoutId = setTimeout(checkAuth, 100);
    
    const handleAuthChange = () => {
      console.log("MainNav: auth-change event received");
      checkAuth();
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        console.log("MainNav: localStorage access_token changed");
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleRouteChange = () => {
      console.log("MainNav: Route changed, checking auth");
      checkAuth();
    };
    
    router.events?.on('routeChangeComplete', handleRouteChange);
    
    const intervalId = setInterval(checkAuth, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  function logout() {
    removeToken();
    setToken(null);
    setUserName(null);
    router.push("/login");
  }

  const isLoggedIn = !!token;

  return (
    <>
      <Navbar className="fixed-top" bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} href={isLoggedIn ? "/" : "/login"}>
            Rohit Sivakumar
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/about">About</Nav.Link>
            </Nav>

            {isLoggedIn ? (
              <Nav>
                <NavDropdown title={userName} id="user-nav-dropdown">
                  <NavDropdown.Item as={Link} href="/favourites">Favourites</NavDropdown.Item>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link as={Link} href="/register">Register</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /><br />
    </>
  );
}
