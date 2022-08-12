import { React, useState ,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import styles from '../styles/form.module.css'

const streamElement = (streamInfo) => {
  return (
    <div>
      nice
      <div>{streamInfo.streamName}</div>
      <div>{streamInfo.hostId}</div>
      <div>{streamInfo.thumbNail}</div>
      <div>{streamInfo.streamStart}</div>
    </div>
  )
}

const Streams = () => {
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
      <div>{streams.map(ele => streamElement(ele))}</div>
    </div>
  )
}

export { Streams };