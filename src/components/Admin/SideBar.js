import React from "react";
import styles from "./AdminComponents.module.css";
import { Link } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
const SideBar = () => {
  const { user } = useAuthValue();
  return (
    <div className={styles.sidebar}>
      {user ? (
        <>
          <div className={styles.button}>
            <Link to={"/admin/authusers"}>Autorizações</Link>
          </div>
          <div className={styles.button}>
            <Link to={"/admin/users"}>Clientes</Link>
          </div>
        </>
      ) : (
        <div className={styles.button}>Faça seu Login</div>
      )}
    </div>
  );
};

export default SideBar;
