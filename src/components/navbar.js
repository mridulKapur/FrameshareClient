import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/nav.module.css'

const Navbar = () => {
  return (
		<div className={styles.container}>
			<ul className={styles.navLinksContainer}>
        <li className={`${styles.link} ${styles.home}`}><Link to='/'>Home</Link></li>
        <ul className={styles.navLinks}>
          <li className={styles.link}><Link to='/streams'>Stream</Link></li>
          <li className={styles.link}><Link to='/room/join'>Join room</Link></li>
          <li className={styles.link}><Link to='/user/signup'>Signup</Link></li>
          <li className={styles.link}><Link to='/user/login'>Login</Link></li>
        </ul>
			</ul>
		</div>
	);
}

export { Navbar }