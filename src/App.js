import React, { useState, useEffect } from 'react';
import { NavLink, Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

import './App.css';
import Example from './pages/Example/Example';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    const setAutoLogout = ms => {
      setTimeout(() => {
        logoutHandler();
      }, ms);
    };

    if (!token || !expiryDate) {
      return;
    }

    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    const userId = localStorage.getItem('userId');
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();

    setIsAuth(true);
    setToken(token);
    setUserId(userId);
    setAutoLogout(remainingMilliseconds);
  }, []);

  const logoutHandler = () => {
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);

    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
      }),
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        setIsAuth(true);
        setToken(resData.token);
        setAuthLoading(false);
        setUserId(resData.userId);
        localStorage.setItem('token', resData.token);
        localStorage.setItem('userId', resData.userId);

        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds,
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());

        setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        setIsAuth(false);
        setAuthLoading(false);
        setError(err);
        console.log(error);
      });
  };

  const signupHandler = (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);

    fetch('http://localhost:8080/auth/signup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: authData.signupForm.email.value,
        password: authData.signupForm.password.value,
        name: authData.signupForm.name.value,
      }),
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!",
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        return res.json();
      })
      .then(() => {
        setIsAuth(false);
        setAuthLoading(false);
        history.replace('/');
      })
      .catch(err => {
        console.log(err);
        setIsAuth(false);
        setAuthLoading(false);
        setError(err);
      });
  };

  const setAutoLogout = ms => {
    setTimeout(() => {
      logoutHandler();
    }, ms);
  };

  let routes = (
    <Switch>
      <Route
        path='/'
        exact
        render={props => (
          <Login {...props} onLogin={loginHandler} loading={authLoading} />
        )}
      />
      <Route
        path='/signup'
        exact
        render={props => (
          <Signup {...props} onSignup={signupHandler} loading={authLoading} />
        )}
      />
      <Redirect to='/' />
    </Switch>
  );

  if (isAuth) {
    routes = (
      <Switch>
        <Route
          path='/'
          exact
          render={() => <Example userId={userId} token={token} />}
        />
        <Redirect to='/' />
      </Switch>
    );
  }

  return (
    <div className='App'>
      <header className='header'>
        <NavLink to='/login'>Login</NavLink>
        <NavLink to='/signup'>Signup</NavLink>
      </header>
      <main>{routes}</main>
    </div>
  );
}

export default App;
