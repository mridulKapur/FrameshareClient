import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Room, RoomId } from "./components/room.js";
import { User, Login, Signup } from "./components/user.js";
import { Streams } from "./components/streams.js";
import { Navbar } from "./components/navbar.js";
import JoinRoom from "./components/joinRoom.js";
import styles from "./styles/home.module.css";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<div className={styles.mainContainer}>
				<Routes>
					<Route path='streams' element={<Streams />}></Route>
					<Route path='room' element={<Room />}>
						<Route path='join' element={<JoinRoom />} />
						<Route path=':roomId' element={<RoomId />} />
					</Route>
					<Route path='user' element={<User />}>
						<Route path='login' element={<Login />} />
						<Route path='signup' element={<Signup />} />
					</Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
