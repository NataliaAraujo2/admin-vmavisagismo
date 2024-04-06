import { useAuthentication } from "./hooks/useAuthentication";
import { useEffect, useState } from "react";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
//context
import { AuthProvider } from "./context/AuthContext";
import Admin from './pages/Admin/Admin'
import Login from './pages/Login/Login'
import AuthUsers from './pages/Admin/AuthUsers'
import EditAuth from './pages/Admin/EditAuth'
import UserData from './pages/Admin/UserData'
import Users from './pages/Admin/Users'
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(undefined);

  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }
  return (
    <AuthProvider value={{ user }}>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/admin" element={<Admin />} />

            <Route
              path="/"
              element={<Login />}
            />

            <Route path="/admin/authusers" element={<AuthUsers/>} />
            <Route path="/admin/editauth/:id" element={<EditAuth/>} />
            <Route path="/admin/userdata/:id" element={<UserData/>} />
            <Route path="/admin/users" element={<Users/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
