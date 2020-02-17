import React, { useState } from 'react';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../utils/validators';

import './Signup.css';

function Signup({ onSignup }) {
  const [signupForm, setSignupForm] = useState({
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
    name: {
      value: '',
      valid: false,
      touched: false,
      validators: [required],
    },
  });

  const inputChangeHandler = (input, value) => {
    const prevSignForm = signupForm;
    setSignupForm(() => {
      let isValid = true;
      for (const validator of prevSignForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevSignForm,
        [input]: {
          ...prevSignForm[input],
          valid: isValid,
          value: value,
        },
      };

      return updatedForm;
    });
  };

  const inputBlurHandler = input => {
    const prevSignForm = signupForm;
    setSignupForm({
      ...prevSignForm,
      [input]: {
        ...prevSignForm[input],
        touched: true,
      },
    });
  };

  return (
    <form onSubmit={e => onSignup(e, this.state)}>
      <Input
        id='email'
        label='Your E-Mail'
        type='email'
        control='input'
        onChange={inputChangeHandler}
        onBlur={() => inputBlurHandler('email')}
        value={signupForm['email'].value}
        valid={signupForm['email'].valid}
        touched={signupForm['email'].touched}
      />
      <Input
        id='name'
        label='Your Name'
        type='text'
        control='input'
        onChange={inputChangeHandler}
        onBlur={() => inputBlurHandler('name')}
        value={signupForm['name'].value}
        valid={signupForm['name'].valid}
        touched={signupForm['name'].touched}
      />
      <Input
        id='password'
        label='Password'
        type='password'
        control='input'
        onChange={inputChangeHandler}
        onBlur={() => inputBlurHandler('password')}
        value={signupForm['password'].value}
        valid={signupForm['password'].valid}
        touched={signupForm['password'].touched}
      />
      <Button type='submit'>Signup</Button>
    </form>
  );
}

export default Signup;
