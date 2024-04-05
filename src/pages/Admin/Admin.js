import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { useAuthValue } from "../../context/AuthContext";
import SideBar from "../../components/Admin/SideBar";
import { useQueries } from "../../hooks/useQueries";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [cancelled, setCancelled] = useState(false);
  const [authUser, setAuthUser] = useState(false);
  const { user } = useAuthValue();
  const navigate = useNavigate();

  const { filter, document } = useQueries("users");

  useEffect(() => {
    async function loadData() {
      if (cancelled) return;

      setAuthUser(false);

      try {
        const field = "uid";
        const demand = user.uid;
        await filter(field, demand);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }

    loadData();

    console.log(document.authUser);

    return () => setCancelled(true);
  }, [document, filter, user, navigate, cancelled, authUser]);

  return (
    <div className={styles.admin}>
      {!document ? (
        <>
          <p>Carregando...</p>
        </>
      ) : (
        <>
          {document.authUser === "admin" ? (
            <>
              <SideBar />
              <div className={styles.main}> BEM VINDO </div>
            </>
          ) : (
            <p>USUÁRIO NÃO AUTORIZADO!</p>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
