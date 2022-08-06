import {React,useState} from 'react'
import { Outlet } from 'react-router-dom'; 
import styles from '../styles/form.module.css';

const User = () => {
  return (
    <Outlet/>
  )
}

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
// myHeaders.append("Cookie", "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTIyYTY3MTE4NDQxMTk4OGQxNGMzYyIsImlhdCI6MTY1Mzc0NjI3OSwiZXhwIjoxNjUzNzQ5ODc5fQ.4GGBVeq7vAasz6ro4AhUbLjBpEPf54bqlasAJIiCkUI");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  redirect: 'follow'
};

const Login = () => {
  const[email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    var raw = JSON.stringify({email,password});
    fetch("https://codealive.herokuapp.com/api/v1/users/login", {...requestOptions,body:raw})
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  }
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) =>{
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({email, password });
    login();
  }

  return(
    <div className={styles.container}>
      <div className={styles.header}>Login</div>
      <div className={styles.formContainer}> 
        <form onSubmit={handleSubmit} className={styles.form} autocomplete="off" spellCheck="false">
          <div className={styles.inputContainer}>
            <input type="text" value={email.value} onChange={handleEmailChange} />
            <label>Email</label>
          </div>
          <div className={styles.inputContainer}>
            <input type="password" value={password.value} onChange={handlePasswordChange} />
            <label>Password</label>
          </div>
          <input type="submit" value="Submit" className={styles.btn}/>
        </form>
      </div>  
    </div>
  )
}

const Signup = () => {
  const[userName, setUserName] = useState('');
  const[email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signup = async () => {
    var raw = JSON.stringify({name:userName,email,password});
    fetch("https://codealive.herokuapp.com/api/v1/users/signup", {...requestOptions,body:raw})
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  }

  const handleNameChange = (e) =>{
    setUserName(e.target.value)
  }
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) =>{
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ userName, email, password });
    signup();
  }

  return(
    <div className={styles.container}>
      <div className={styles.header}>Sign up</div>
      <div className={styles.formContainer}> 
        <form onSubmit={handleSubmit} className={styles.form} autocomplete="off" spellCheck="false">
          <div className={styles.inputContainer}>
            <input type="text" value={userName.value} onChange={handleNameChange} />
            <label>Name</label>
          </div>
          <div className={styles.inputContainer}>
            <input type="text" value={email.value} onChange={handleEmailChange} />
            <label>Email</label>
          </div>
          <div className={styles.inputContainer}>
            <input type="password" value={password.value} onChange={handlePasswordChange} />
            <label>Password</label>
          </div>
          <input type="submit" value="Submit" className={styles.btn}/>
        </form>
      </div>  
    </div>
  )
}

export {User,Login,Signup}