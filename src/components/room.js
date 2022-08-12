import {React,useEffect,useState,useRef} from 'react'
import { useParams, Outlet, useLocation, useNavigate} from "react-router-dom";

import AgoraRTM from "agora-rtm-sdk"
import AgoraRTC from "agora-rtc-sdk-ng"
import useAgoraRtm from "../hooks/createClient.js"

import styles from "../styles/room.module.css"

let appID = "0f436fb449614271ad9870b7b24c33fc"; 

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
    fetch("http://localhost:8080/api/v1/streams/addStream", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
}

const Room = () => {
  return (
      <Outlet/>
  )
}

const RoomId = () => {
  let localScreenTracks,messages, sendChannelMessage, users,rtcClient,rtmClient;
  const navigate = useNavigate();
  const { state } = useLocation();
  const { roomId } = useParams();
  console.log(state);
  if (state!==null) {
    state.roomId = roomId;
    if(state.role==="host")
      addToDb(state);   
    rtcClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    rtmClient = AgoraRTM.createInstance(appID);
  }
  ({ messages, sendChannelMessage, users } = useAgoraRtm(roomId, rtmClient, rtcClient, state.host, appID, state.role));
  
  const [track, setTrack] = useState();
  const [textArea, setTextArea] = useState("");
  const [streaming, setSetreaming] = useState(false);
  // const [names, setNames] = useState([]);
  const messagesEndRef = useRef(null)

  const toggleVideoShare = async () => {
    if (!streaming) { 
      await rtcClient.setClientRole('host');
      localScreenTracks = await AgoraRTC.createScreenVideoTrack();
      localScreenTracks.play('me')
      setTrack(localScreenTracks);
      await rtcClient.publish(localScreenTracks);
      setSetreaming (true);
      // console.log(streaming);
    }
    else {
      // localScreenTracks.stop();
      await rtcClient.unpublish();
      setSetreaming(false);
      track.stop();
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (!state)
      navigate(`/room/join`);
  },[])

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  useEffect(() => {
    rtcClient?.on("user-published", async (user, mediaType) => {
      await rtcClient.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play("me");
      }
    })
  //   toggleVideoShare();
  }, [])

  const submitMessage = (e) => {
    e.preventDefault();
    console.log(e.target);
    sendChannelMessage(textArea);
    setTextArea("");
    // console.log(messages)
  };
 
  return (
    <div className={styles.room}>
      <div className={styles.roomName}>
        {state.name}
      </div>
      <div className={styles.roomComponents}>  
        <section id="users_container" className={styles.usersContainer}>
          <div className={styles.usersHeader}>USERS</div>
          <div className={styles.usersList}>{users.map((user, index) => <div className={styles.userItem} key={index}><div className={styles.greenDot}></div>{user}</div>)}</div>
        </section>
        <section id="video" className={styles.videoContainer}>
          <div id="me" className={styles.video}></div>
          {state.role === "host" ? <button onClick={toggleVideoShare} className={styles.startStreamBtn}>{}</button> : null}
        </section>
        <section id="chat__container" className={styles.chatContainer}>
          <div id="messages" className={styles.chatBox}>
            {messages.map((message,index) => {
              return message.message ? (
                <div key={index}>
                  <div>{message.uid}</div>  
                  <div>{message.message}</div>  
                </div>
                ):null
              }
            )}
            <div ref={messagesEndRef} />
          </div>
        <div id="form__container">
            <input type="text" placeholder="message here" name="message" onChange={(e) => setTextArea(e.target.value)} value={textArea} />
            <button onClick={submitMessage}>send</button>
        </div> 
        </section>
      </div>
    </div>
  )
}

export { Room, RoomId }


