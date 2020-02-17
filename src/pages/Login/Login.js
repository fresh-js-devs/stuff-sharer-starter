import React, { useState } from 'react';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import { required, length, email } from '../../utils/validators';

import './Login.css';

function Login({ onLogin }) {
  const [loginForm, setLoginForm] = useState({
    email: {
      value: '',
      valid: false,
      touched: false,
      validators: [required, email],
    },
    password: {
      value: '',
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })],
    },
  });

  const inputChangeHandler = (input, value) => {
    const prevLoginForm = loginForm;
    setLoginForm(() => {
      let isValid = true;
      for (const validator of prevLoginForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevLoginForm,
        [input]: {
          ...prevLoginForm[input],
          valid: isValid,
          value: value,
        },
      };

      return updatedForm;
    });
  };

  const inputBlurHandler = input => {
    const prevLoginForm = loginForm;
    setLoginForm({
      ...prevLoginForm,
      [input]: {
        ...prevLoginForm[input],
        touched: true,
      },
    });
  };

  if (loginForm) {
    return (
      <form
        onSubmit={e =>
          onLogin(e, {
            email: loginForm.email.value,
            password: loginForm.password.value,
          })
        }
      >
        <Input
          id='email'
          label='Your E-Mail'
          type='email'
          control='input'
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler('email')}
          value={loginForm['email'].value}
          valid={loginForm['email'].valid}
          touched={loginForm['email'].touched}
        />
        <Input
          id='password'
          label='Password'
          type='password'
          control='input'
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler('password')}
          value={loginForm['password'].value}
          valid={loginForm['password'].valid}
          touched={loginForm['password'].touched}
        />
        <Button type='submit'>Login</Button>
      </form>
    );
  }
}

export default Login;
