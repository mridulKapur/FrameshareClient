import { React, useState ,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import styles from '../styles/stream.module.css'
import md5 from "crypto-js/md5"

const streamElement = (streamInfo) => {
  const join = () => {
		streamInfo.navigate(`/room/${md5(streamInfo.hostId)}`, {
			state: {
				host:"randombo",
        role: "audience",
        name:streamInfo.streamName,
			},
		});
  }
  const start = new Date(Date.now()),end = new Date(streamInfo.streamStart);
  const diff = start.getTime()-end.getTime();
  const t = new Date(diff);
  const h = t.getUTCHours();
  const m = t.getUTCMinutes();
  console.log(streamInfo.thumbNail);
  return (
    <div onClick={join} className={styles.streamElement}>
      <div className={styles.streamThumbnail} style={{backgroundImage: `url(${streamInfo?.thumbNail}) , url("https://picsum.photos/id/237/200/300")`}}></div>
      <div className={styles.streamInfo}>{streamInfo.streamName}</div>
      <div className={styles.streamHost}>{streamInfo.hostId}</div>
      <div className={styles.streamtime}>{h}:{m} hours ago</div>
    </div>
  )
}

const Streams = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  const fetchStreams = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:8080/api/v1/streams/getStreams", requestOptions)
      .then(response => response.text())
      .then(result => {setStreams(JSON.parse(result).data.streams) })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    fetchStreams();

  },[])

  
  return (
    <div className={styles.container}>
      <div className={styles.streamsContainer}>{streams.map(ele => streamElement({...ele,navigate}))}</div>
    </div>
  )
}

export { Streams };