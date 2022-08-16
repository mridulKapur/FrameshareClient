import { React, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/form.module.css";
import md5 from 'crypto-js/md5';

const JoinRoom = () => {
	const [hostName, setHostName] = useState("");
	const [channel, setChannel] = useState("");
	const [thumbNail, setThumbNail] = useState("");
	const [protect, setProtect] = useState(false);
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handle_name_change = (e) => {
		setHostName(e.target.value);
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
		e.preventDefault();
		navigate(`/room/${md5(hostName)}`, {
			state: {
				host:hostName,
        role: "host",
        name:channel,
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
						<input onChange={handle_name_change} id='name' type='text' value={hostName} />
						<label>Name</label>
					</div>
					<div className={styles.inputContainer}>
						<input onChange={handle_ch_change} id='channel' type='text' value={channel} />
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
