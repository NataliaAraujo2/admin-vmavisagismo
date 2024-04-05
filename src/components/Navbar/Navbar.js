import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../images/logobremoved.png";

import { useAuthentication } from "../../hooks/useAuthentication";
import { useAuthValue } from "../../context/AuthContext";

const Navbar = () => {
  const [dateNow, setDateNow] = useState("");

  const { user } = useAuthValue();
  const { logout } = useAuthentication();

  const navigate = useNavigate();

  useEffect(() => {
    const date = () => {
      const now = new Date();

      const dayName = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "ábado",
      ];

      const monName = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "agosto",
        "outubro",
        "novembro",
        "dezembro",
      ];

      const agora = ` ${dayName[now.getDay()]}, ${now.getDate()} de ${
        monName[now.getMonth()]
      } de ${now.getFullYear()}`;

      setDateNow(agora);
    };

    date();

    return () => {};
  }, []);

  const handleSubmit = (e) => {
    navigate("/");
  };

  const handleSubmitExit = (e) => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <NavLink to="/">
        <img src={logo} alt="Logo" />
      </NavLink>

      <ul className={styles.link_list}>
        {!user ? (
          <div className={styles.dateNow}>
            <li>{dateNow}</li>
            <li>
              <button onClick={handleSubmit}>Entrar</button>
            </li>
          </div>
        ) : (
          <div className={styles.dateNow}>
            <li>{dateNow}</li>
            <li>
              <button onClick={handleSubmitExit}>Sair</button>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
