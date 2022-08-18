import {useEffect,useState,useRef} from "react";
import AgoraRTM from "agora-rtm-sdk"
import AgoraRTC from "agora-rtc-sdk-ng"

let rtcuid = Math.floor(Math.random() * 256)
let uid = String(rtcuid);
let token = undefined
let tokenRtc = undefined
let appID = "0f436fb449614271ad9870b7b24c33fc";

const useAgoraRtm = (roomName, name, role,rtcClient) => {
  const rtmClient = AgoraRTM.createInstance(appID);
  const [streaming, setSetreaming] = useState(false);
  const [track, setTrack] = useState(false);
  const [messages, setMessages] = useState([{}]);
  const [users, setUsers] = useState([]);
  const [currentMessage, setCurrentMessage] = useState({});
  const channel = useRef(rtmClient.createChannel(roomName)).current;

  const initRtm = async () => {
    console.log(role);
    await fetch(`http://localhost:8080/api/v1/agora/rtmToken?account=${uid}`)
      .then(data => {
        return data.json();
      })
      .then(data => {
        token = data.key;
      });
    await rtmClient.login({ uid, token });
    await channel.join();
    await rtmClient.addOrUpdateLocalUserAttributes({ 'name': name });
    await setUsersState();
    await fetch(`http://localhost:8080/api/v1/agora/rtcToken?channelName=${roomName}`)
      .then(data => {
        return data.json();
      })
      .then(data => {
        tokenRtc = data.key;
      });
    //LOGIN
    
    const options = {
      // Pass your app ID here.
      appId: appID,
      // Set the channel name.
      channel: roomName,
      // Set the user role in the channel.
      // role: role,
      // Use a temp token
      token: tokenRtc,
      // Uid
      uid: rtcuid
    }
    // const clientRoleOptions = {
    //   // Set latency level to low latency
    //   level: 2
    // }
    rtcClient.setClientRole(role)
    await rtcClient.join(options.appId, options.channel, options.token, options.uid);
    const users = rtcClient.remoteUsers;
    console.log(users);
  }

  const getUserAtt = async (memberId) => {
    return await rtmClient.getUserAttributes(memberId, ['name']);
  }

  const setUsersState = async () => {
    const members = await channel.getMembers();
    var names = [];
    for (var i = 0; i < members.length ; i++) {
      let { name } = await getUserAtt(members[i]);
      names = [...names, name]
    }
    setUsers(names);
  }

  const leave = async () => {
    await channel.leave();
    await rtmClient.logout();
  }

  const handleMessageReceived = async (data, uid) => {
    const user = await rtmClient.getUserAttributes(uid);
    if (data.messageType === "TEXT") {
      const newMessageData = {uid:user.name, message: data.text };
      setCurrentMessage(newMessageData);
    }
  };  

  const sendChannelMessage = async (text) => {
    channel
      .sendMessage({ text })
      .then(() => {
        setCurrentMessage({
          uid:name,
          message: text,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleVideoShare = async () => {
    if (!streaming) { 
      await rtcClient.setClientRole('host');
      const localScreenTracks = await AgoraRTC.createScreenVideoTrack();
      setTrack(localScreenTracks);
      localScreenTracks.play('me')
      await rtcClient.publish(localScreenTracks);
      setSetreaming (true);
    }
    else {
      await rtcClient.unpublish();
      setSetreaming(false);
      track.stop();
    }
  }

  useEffect(() => {
    initRtm();
  }, []);

  useEffect(() => {
    rtcClient.on("user-published", async (user, mediaType) => {
      await rtcClient.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play("me");
      }
    })
  }, [])

  useEffect(() => {
      window.addEventListener("beforeunload", leave);
      return () => window.removeEventListener("beforeunload", leave);
  }, []);
  
  useEffect(() => {
    console.log(users);
  },[users])

  useEffect(() => {
    channel.on("MemberJoined",async (uid) => {
      const { name } = await rtmClient.getUserAttributes(uid, ['name']);
      setUsers(users => [...users,name]);
    });
    channel.on("ChannelMessage", (data, uid) => {
      handleMessageReceived(data, uid);
    });
    channel.on('MemberLeft', () => {
      setUsers(users => users.filter(user => user !== name))
    })
  }, []);

  useEffect(() => {
    if (currentMessage) setMessages([...messages, currentMessage]);
  }, [currentMessage]);


  return { sendChannelMessage, messages,toggleVideoShare};
};

export default useAgoraRtm;