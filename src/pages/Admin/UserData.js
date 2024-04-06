import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import styles from "./Admin.module.css";
import SideBar from "../../components/Admin/SideBar";
import ResumeData from "../../components/Data/ResumeData";

const UserData = () => {
  const photoUrl =
    "https://firebasestorage.googleapis.com/v0/b/vmavisagismo.appspot.com/o/logobremoved.png?alt=media&token=e259ce3f-06bd-4e9a-9429-3e1a85a3eb99";

  const [openFirstForm, setOpenFirstForm] = useState(false);

  const { id } = useParams();
  const { document: auth, loading } = useFetchDocument("users", id);

  return (
    <div className={styles.admin}>
      <SideBar />

      <div className={styles.main}>
        {loading && <p>Carregando informações ...</p>}
        {auth && (
          <div className={styles.auth}>
            <div className={styles.userData}>
              <div className={styles.profilePictureAvatar}>
      
                {!auth.profilePicture ? (
                  <img src={photoUrl} alt="Imagem" className={styles.avatar} />
                ) : (
                  <img
                    src={auth.profilePicture}
                    alt="Imagem"
                    className={styles.avatar}
                  />
                 )} 
              </div>
              <div className={styles.userAuth}>
                <span className={styles.item}>
                  <b>Usuário:</b> {auth.name}
                </span>
                <span className={styles.item}>
                  <b>E-mail:</b> {auth.email}
                </span>
                <span className={styles.item}>
                  <b>Autorização:</b> {auth.authUser}
                </span>
              </div>
            </div>
            <button onClick={() => setOpenFirstForm(true)}>
              Formulários Respondidos
            </button>
            <ResumeData
              isOpen={openFirstForm}
              setModalOpen={() => setOpenFirstForm(!openFirstForm)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserData;
