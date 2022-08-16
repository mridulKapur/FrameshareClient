import { React, useState ,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import styles from '../styles/form.module.css'
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
  return (
    <div onClick={join}>
      nice
      <div>{streamInfo.streamName}</div>
      <div>{streamInfo.hostId}</div>
      <div>{streamInfo.thumbNail}</div>
      <div>{streamInfo.streamStart}</div>
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
    <div>
      <div>Streams</div>
      <div>{streams.map(ele => streamElement({...ele,navigate}))}</div>
    </div>
  )
}

export { Streams };