import React, { useState, useReducer, useEffect, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT')
    return { value: action.value, isValid: action.value.includes('@') };
  if (action.type === 'INPUT_BLUR')
    return { value: state.value, isValid: state.value.includes('@') };
  return { value: '', isValid: false };
};
const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT')
    return { value: action.value, isValid: action.value.length > 6 };
  if (action.type === 'INPUT_BLUR')
    return { value: state.value, isValid: state.value.length > 6 };
  return { value: '', isValid: false };
};

const Login = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const ctx = useContext(AuthContext);
  const [emailState, emailDispatch] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, passwordDispatch] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const { isValid: emailValid } = emailState;
  const { isValid: passwordValid } = passwordState;

  useEffect(() => {
    const int = setTimeout(() => {
      setFormIsValid(emailValid && passwordValid);
    }, 500);
    return () => {
      clearInterval(int);
    };
  }, [emailValid, passwordValid]);

  const emailChangeHandler = (event) => {
    emailDispatch({ type: 'USER_INPUT', value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    passwordDispatch({ type: 'USER_INPUT', value: event.target.value });
  };

  const validateEmailHandler = () => {
    emailDispatch({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    passwordDispatch({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id='email'
          type='email'
          label='E-mail'
          value={emailState.value}
          changeHandler={emailChangeHandler}
          validateChangeHandler={validateEmailHandler}
        ></Input>
        <Input
          id='password'
          type='password'
          label='Password'
          isValid={passwordState.isValid}
          value={passwordState.value}
          changeHandler={passwordChangeHandler}
          validateChangeHandler={validatePasswordHandler}
        ></Input>
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
