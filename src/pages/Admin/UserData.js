import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import styles from "./Admin.module.css";
import SideBar from "../../components/Admin/SideBar";
import ResumeData from "../../components/Data/ResumeData";

const UserData = () => {
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authUser, setAuthUser] = useState("");
  const [photoUrl, setPhotoUrl] = useState("https://firebasestorage.googleapis.com/v0/b/vanessaalbuquerquevisagismo.appspot.com/o/images%2Flogo.png?alt=media&token=aa8651c0-fb6b-442e-a218-366ba5f5bb21");
  const [cancelled, setCancelled] = useState(false);
  const [openFirstForm, setOpenFirstForm] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { document: auth } = useFetchDocument("users", id);

  useEffect(() => {
    if (cancelled) return;


    async function loadData() {
      if (auth) {

        try {
          await setUid(auth.uid);
          await setName(auth.name);
          await setEmail(auth.email);
          await setAuthUser(auth.authUser);
          if (!auth.profilePicture) {
            await setPhotoUrl(photoUrl);
          } else {
            await setPhotoUrl(auth.profilePicture);
          }
        } catch (error) {}
      }
    }

    try {
      loadData();
  
    } catch (error) {
      console.log(error);
    }

    return () => setCancelled(true);
  }, [auth, uid, cancelled, authUser, navigate, photoUrl]);

      console.log(name);
      console.log(email);
      console.log(authUser);
      console.log(uid);

  return (
    <div className={styles.admin}>
      <SideBar />
      <div className={styles.main}>
        <div className={styles.auth}>
          <div className={styles.userData}>
            <div className={styles.profilePictureAvatar}>
              <img src={photoUrl} alt="Imagem" className={styles.avatar} />
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
          <ResumeData isOpen={openFirstForm} setModalOpen={()=> setOpenFirstForm(!openFirstForm)} />
        </div>
      </div>
    </div>
  );
};

export default UserData;
