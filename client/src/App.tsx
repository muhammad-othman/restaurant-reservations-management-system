import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth-pages/LoginPage';
import AuthContext from './contexts/AuthContext';
import LoadingContext from './contexts/LoadingContext';
import SignUpPage from './pages/auth-pages/SignupPage';
import CreateRestaurantPage from './pages/auth-pages/CreateRestaurantPage';
import NavBar from './components/NavBar';
import { Container } from 'react-bootstrap';
import ReportsPage from './pages/ReportsPage';
import ReservationsPage from './pages/ReservationsPage';

const App = () => {

  const { currentUser } = useContext(AuthContext);
  const { pathname } = useLocation();
  const { stopLoading } = useContext(LoadingContext);


  useEffect(() => {
    stopLoading();
  }, [pathname]);

  return (
    <>
      {currentUser && currentUser.restaurant ?
        <>
          <NavBar />
          <Container>
            <Routes>
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </Container>
        </>
        :
        <>
          {currentUser ?
            <>
              <NavBar />
              <Container>
                <Routes>
                  <Route path="/" element={<CreateRestaurantPage />} />
                  <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
              </Container>
            </>
            :
            <Container>
              <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
              </Routes>
            </Container>
          }
        </>
      }

    </>
  );
}

export default App;
