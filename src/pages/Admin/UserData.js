import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import styles from "./Admin.module.css";
import SideBar from "../../components/Admin/SideBar";
import ResumeData from "../../components/Data/ResumeData";

const UserData = () => {
const [name, setName] = useState("")
 const [profilePicture, setProfilePicture] = useState("")
 const [email, setEmail] = useState("")
 const [authUser, setAuthUser] = useState("")
   
  const [cancelled, setCancelled] = useState(false);
  const [openFirstForm, setOpenFirstForm] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { document: auth } = useFetchDocument("users", id);

useEffect(() => {
  
  if(auth) {
    setName(auth.name)
    setEmail(auth.email)
    setAuthUser(auth.authUser)
    setProfilePicture(auth.profilePicture)  
  }

  return () => {

  }
}, [cancelled, auth ])

  
  return (
    <div className={styles.admin}>
      <SideBar />
      <div className={styles.main}>
        <div className={styles.auth}>
          <div className={styles.userData}>
            <div className={styles.profilePictureAvatar}>
           
                <img src={profilePicture} alt="Imagem" className={styles.avatar} />
     
            </div>
            <div className={styles.userAuth}>
              <span className={styles.item}>
                <b>Usuário:</b> {name}
              </span>
              <span className={styles.item}>
                <b>E-mail:</b> {email}
              </span>
              <span className={styles.item}>
                <b>Autorização:</b> {authUser}
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
      </div>
    </div>
  );
};

export default UserData;
