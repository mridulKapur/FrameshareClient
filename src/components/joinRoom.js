import { React, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import styles from '../styles/form.module.css'


const JoinRoom = () => {
  const [name, setName] = useState("")
  const [ch, setChannel] = useState("")
  const [role, setRole] = useState("")
  const navigate = useNavigate();

  const handel_name_change = (e) => {
    setName(e.target.value);
  }
  const handel_ch_change = (e) => {
    setChannel(e.target.value);
  }

  const handelSubmit = (e) => {
    // console.log(e.target[0].value);
    e.preventDefault();
    navigate(`/room/${ch}`, {state:{ name: e.target[0].value , role:role}});
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Join Room</div>
      <div className={styles.formContainer}> 
        <form onSubmit={handelSubmit} className={styles.form} autocomplete="off" spellCheck="false">
        <div className={styles.inputContainer}>
            <input onChange={handel_name_change} id="name" type="text" value={name} />
            <label>Name</label>
        </div>
        <div className={styles.inputContainer}>    
            <input onChange={handel_ch_change} id="channel" type="text" value={ch} />
            <label>channel name</label>
        </div>
          <div className={styles.options}>
          <div>
            <input onChange={() => setRole("host")} type="radio" id="host" name="role" value="host"/>
            <label htmlFor="host">HOST</label>
            </div>
          <div>
            <input onChange={() => setRole("audience")} type="radio" id="participant" name="role" value="participant"/>
              <label htmlFor="participant">PARTICIPANT</label>
          </div>    
        </div>
        <button type="submit" className={styles.btn}>join</button>
      </form>
      </div>
    </div>
  )
}

export default JoinRoom