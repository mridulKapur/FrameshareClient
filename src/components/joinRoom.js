import { React, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/form.module.css";
import crypto from "crypto-js";
import md5 from 'crypto-js/md5';

const JoinRoom = () => {
	const [name, setName] = useState("");
	const [ch, setChannel] = useState("");
	const [thumbNail, setThumbNail] = useState("");
	const [protect, setProtect] = useState(false);
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handle_name_change = (e) => {
		setName(e.target.value);
	};
	const handle_ch_change = (e) => {
		setChannel(e.target.value);
	};
	const handle_pass_change = (e) => {
		setPassword(e.target.value);
	};

  const handle_thum_change = (e) => {
    setThumbNail(e.target.value);
  };

	const handle_protect = () => {
		setProtect((protect) => !protect);
	};

	useEffect(() => {
    if (!protect) setPassword("public room");
    else {
      setPassword("set password");
    }
	}, [protect]);

	const handle_submit = (e) => {
		// console.log(e.target[0].value);
		e.preventDefault();
		navigate(`/room/${md5(name)}`, {
			state: {
				host: e.target[0].value,
        role: "host",
        name:e.target[1].value,
        thumbNail: thumbNail,
        protection: protect,
        password: password,
			},
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>Join Room</div>
			<div className={styles.formContainer}>
				<form
					onSubmit={handle_submit}
					className={styles.form}
					autoComplete='off'
					spellCheck='false'>
					<div className={styles.inputContainer}>
						<input onChange={handle_name_change} id='name' type='text' value={name} />
						<label>Name</label>
					</div>
					<div className={styles.inputContainer}>
						<input onChange={handle_ch_change} id='channel' type='text' value={ch} />
						<label>channel name</label>
          </div>
          <div className={styles.inputContainer}>
            <input onChange={handle_thum_change} id='thumbNail' type='text' value={thumbNail} />
						<label>Thumbnail Link</label>
					</div>
					<div className={styles.options}>
						<input onChange={handle_protect} type='checkbox' id='protected' />
						<label>Private</label>
					</div>
					<div className={styles.inputContainer}>
						<input
							disabled={!protect}
							onChange={handle_pass_change}
							id='password'
							type='text'
							value={password}
						/>
						<label>Password</label>
					</div>

					<button type='submit' className={styles.btn}>
						join
					</button>
				</form>
			</div>
		</div>
	);
};

export default JoinRoom;
