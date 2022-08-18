import { React, useEffect, useState, useRef } from "react";
import { useParams, Outlet, useLocation, useNavigate } from "react-router-dom";

// import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgoraRtm from "../hooks/createClient.js";

import styles from "../styles/room.module.css";

const addToDb = (data) => {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	var raw = JSON.stringify(data);
	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: raw,
		redirect: "follow",
  };
  console.log(raw);
  fetch("http://localhost:8080/api/v1/streams/addStream", requestOptions)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.log("error", error));
};

const Room = () => {
	return <Outlet />;
};

const rtcClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
const RoomId = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { roomId } = useParams();
  state.roomId = roomId;
  if (state.role === "host") addToDb(state);
	const { messages, sendChannelMessage ,toggleVideoShare} = useAgoraRtm(
		roomId,
		state.host,
		state.role,
		rtcClient
	);
	const [textArea, setTextArea] = useState("");
	const messagesEndRef = useRef(null);

	useEffect(() => {
		if (!state) navigate(`/room/join`);
	}, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

  const submitMessage = (e) => {
    e.preventDefault();
    console.log(e.target);
    sendChannelMessage(textArea);
    setTextArea("");
  };
	
	// const leaveRoom = () => {
	// 	leave();
	// 	navigate(`/`);
	// };

	return (
		<div className={styles.room}>
			{/* <div className={styles.roomName}>{state.name}</div> */}
			<div className={styles.roomComponents}>
				{/* <section id='users_container' className={styles.usersContainer}>
					<div className={styles.usersHeader}>USERS</div>
					<div className={styles.usersList}>
						{users.map((user, index) => (
							<div className={styles.userItem} key={index}>
								<div className={styles.greenDot}></div>
								{user}
							</div>
						))}
					</div>
				</section> */}
				<section id='video' className={styles.videoContainer}>
					<div id='me' className={styles.video}></div>
					{state.role === "host" ? (
						<button onClick={toggleVideoShare} className={styles.startStreamBtn}>
							{}
						</button>
					) : null}
					{/* {state.role === "host" ? (
						<button onClick={leaveRoom} className={styles.startStreamBtn}>
							{}
						</button>
					) : null} */}
				</section>
				<section id='chat__container' className={styles.chatContainer}>
					<div id='messages' className={styles.chatBox}>
						{messages.map((message, index) => {
							return message.message ? (
								<div key={index}>
									<div>{message.uid}</div>
									<div>{message.message}</div>
								</div>
							) : null;
						})}
						<div ref={messagesEndRef} />
					</div>
					<form id='form__container' className={styles.formContainer} onSubmit={submitMessage}>
						<input
							type='text'
							name='message'
							className={styles.formInput}
							onChange={(e) => setTextArea(e.target.value)}
							value={textArea}
						/>
						<input type="submit" value="" className={styles.submitBtn} />
					</form>
				</section>
			</div>
		</div>
	);
};

export { Room, RoomId };
