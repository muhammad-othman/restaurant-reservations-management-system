import React, { useContext } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import RestaurantContext from '../contexts/RestaurantContext';

const NavBar = () => {
  const { userRestaurant } = useContext(RestaurantContext);
  const { currentUser, logout } = useContext(AuthContext);
  return (
    <Navbar bg="light" expand="md" variant="light" style={{ boxShadow: '0 2px 5px 0 rgb(0 0 0 / 8%)' }} className="py-0 mb-3">
      <Container>
        <Navbar.Brand  >
          <Link to="/">
            <img
              src="/logo.svg"
              width="50"
              height="50"
              alt="logo"
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Brand id="restaurant-name">{userRestaurant ? userRestaurant.name : 'Restaurant Reservations Management System'}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'mx-2 active-nav-link' : 'mx-2')}>
            Tables
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? 'mx-2 active-nav-link' : 'mx-2')}>
            Reservations
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'mx-2 active-nav-link' : 'mx-2')}>
            Reports
          </NavLink>
          <Nav className="justify-content-end" style={{ width: "100%" }} >
            <NavDropdown title={currentUser.name} id="nav-dropdown">
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar;
