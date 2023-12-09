"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/FirebaseConfig";

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectedRoomName: string | null;
  setSelectedRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};

const defalutContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectedRoomName: null,
  setSelectedRoomName: () => {},
};

const AppContext = createContext<AppContextType>(defalutContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);

      if (!newUser) {
        router.push("/auth/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);

  return (
    <AppContext.Provider
      value={{
        user,
        userId,
        setUser,
        selectedRoom,
        setSelectedRoom,
        selectedRoomName,
        setSelectedRoomName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
