"use client";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { BiLogOut } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { auth, db } from "../../../lib/FirebaseConfig";

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = () => {
  const { user, userId, setSelectedRoom, setSelectedRoomName } =
    useAppContext();

  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    if (!user) return;
    if (user) {
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, "rooms");
        const q = query(
          roomCollectionRef,
          where("userID", "==", userId),
          orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newRooms: Room[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));
          setRooms(newRooms);
        });
        return () => {
          unsubscribe();
        };
      };
      fetchRooms();
    }
  }, [userId]);

  const selectRoom = (roomId: string, roomName: string) => {
    setSelectedRoom(roomId);
    setSelectedRoomName(roomName);
  };

  const addNewRoom = async () => {
    const roomName = prompt("ルーム名を入力してください");
    if (roomName) {
      const newRoomRef = collection(db, "rooms");
      await addDoc(newRoomRef, {
        name: roomName,
        userID: userId,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="bg-green-600 text-slate-100 h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div
          onClick={addNewRoom}
          className="cursor-pointer text-slate-100 flex justify-evenly font-semibold items-center border mt-2 rounded-md  hover:bg-green-400"
        >
          <span className="p-2 text-2xl">＋</span>
          <h1 className="text-xl p-4 pl-0">New Chat</h1>
        </div>

        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className="cursor-pointer border-b my-4 p-4 bg-cyan-600  hover:bg-cyan-400 rounded-md duration-150 "
              onClick={() => selectRoom(room.id, room.name)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      {user && (
        <div className="mb-2 p-4 text-slate-100 text-lg">{user.email}</div>
      )}
      <div
        onClick={() => handleLogout()}
        className="text-2xl cursor-pointer text-slate-100 flex justify-center items-center mb-8 rounded-md p-4 hover:bg-green-400"
      >
        <BiLogOut />
        <span className="px-4">ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
