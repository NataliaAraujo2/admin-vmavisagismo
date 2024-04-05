import React, { useEffect, useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQueries } from "../../hooks/useQueries";
import styles from "./Admin.module.css";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "../../components/Admin/SideBar";
import { useAuthValue } from "../../context/AuthContext";

const AuthUsers = () => {
  const [queryFilter, setQueryFilter] = useState("");
  const [uid, setUid] = useState("");
  const [filteredDocs, setFilteredDocs] = useState(false);
  const [tooggle, setTooggle] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const { user } = useAuthValue();
  const navigate = useNavigate();

console.log(user.uid)
  const { documents: users } = useFetchDocuments("users");
  const { filter, document: filteredUser, response } = useQueries("users");
  console.log(users)

  useEffect(() => {
    async function loadData() {
      if (cancelled) return;

      if (user) {
        setUid(user.uid);
      }

      try {
        const field = "uid";
        const demand = uid;
        await filter(field, demand);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }

    loadData()

    if (filteredUser) {
      if (filteredUser.authUser === "user") {
        navigate("/system/homesystem");
      }
    }

    return () => setCancelled(true);
  }, [cancelled, filter, navigate, uid, user, filteredUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQueryFilter(e.target.value);
    setTooggle(true);

    const field = "email";
    const demand = queryFilter;
    await filter(field, demand);
    setFilteredDocs(true);
  };

  // console.log(users);

  const handleClear = (e) => {
    e.preventDefault();
    setTooggle(false);
  };

  return (
    <div className={styles.admin}>
      <SideBar />
      <div className={styles.main}>
        <h1>Autorizações</h1>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="searchUser"
            id="searchUser"
            placeholder="Busque por email"
            onChange={(e) => setQueryFilter(e.target.value)}
          />
          {!tooggle ? (
            <button>Pesquisar</button>
          ) : (
            <button onClick={handleClear}>Limpar</button>
          )}
        </form>

        {response.loading && <p>Carregando...</p>}
        {!tooggle
          ? users &&
            users.map((data) => (
              <div key={data.uid} className={styles.table}>
                <div className={styles.item}> {data.name}</div>
                <div className={styles.item}> {data.email}</div>
                <div className={styles.item}> {data.authUser}</div>
                <div className={styles.button}>
                  <Link to={`/admin/editAuth/${data.id}`}>
                    Modificar Autorização?
                  </Link>
                </div>
              </div>
            ))
          : filteredDocs && (
              <div className={styles.table}>
                <div className={styles.item}>{filteredUser.name}</div>
                <div className={styles.item}>{filteredUser.authUser}</div>
                <div className={styles.item}>{filteredUser.email}</div>
                <div className={styles.button}>
                  <Link to={`/admin/editAuth/${filteredUser.id}`}>
                    Modificar Autorização?
                  </Link>
                </div>
              </div>
            )}
      </div>
      {users && users.length === 0 && (
        <div className={styles.noUsers}>
          <p>Não foram encontrados Usuários!</p>
        </div>
      )}
    </div>
  );
};

export default AuthUsers;
