import {useEffect,useState,useRef} from "react";

let rtcuid = Math.floor(Math.random() * 256)
let uid = String(rtcuid);
let token = undefined
let tokenRtc = undefined

const useAgoraRtm = (roomName,client,rtcClient,name,appID,role) => {
  const [messages, setMessages] = useState([{}]);
  const [users, setUsers] = useState([]);
  // const [usersrtc, setUsersrtc] = useState([]);
  const [currentMessage, setCurrentMessage] = useState({});
  const channel = useRef(client.createChannel(roomName)).current;

  const initRtm = async () => {
    console.log(role);
    await fetch(`https://codealive.herokuapp.com/api/v1/agora/rtmToken?account=${uid}`)
      .then(data => {
        return data.json();
      })
      .then(data => {
        token = data.key;
      });
    await client.login({ uid, token });
    await channel.join();
    await client.addOrUpdateLocalUserAttributes({ 'name': name });
    await setUsersState();
    await fetch(`https://codealive.herokuapp.com/api/v1/agora/rtcToken?channelName=${roomName}`)
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
    const users = await rtcClient.remoteUsers;
    console.log(users);
  }

  const getUserAtt = async (memberId) => {
    return await client.getUserAttributes(memberId, ['name']);
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
    await client.logout();
  }

  const handleMessageReceived = async (data, uid) => {
    const user = await client.getUserAttributes(uid);
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

  useEffect(() => {
    initRtm();
  }, []);

  useEffect(() => {
      window.addEventListener("beforeunload", leave);
      return () => window.removeEventListener("beforeunload", leave);
  }, []);
  
  useEffect(() => {
    console.log(users);
  },[users])

  useEffect(() => {
    channel.on("MemberJoined",async (uid) => {
      const { name } = await client.getUserAttributes(uid, ['name']);
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

  return { sendChannelMessage, messages ,users};
};

export default useAgoraRtm;