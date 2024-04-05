import React, { useEffect, useState } from "react";
import SideBar from "../../components/Admin/SideBar";
import styles from "./Admin.module.css";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { useAuthValue } from "../../context/AuthContext";
import { useQueries } from "../../hooks/useQueries";

const EditAuth = () => {
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authUser, setAuthUser] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tooggleAuthSystem, setTooggleAuthSystem] = useState(false);
  const { user } = useAuthValue();
  const navigate = useNavigate();

  const { id } = useParams();
  const { document: auth } = useFetchDocument("users", id);

  const { updateDocument, response } = useUpdateDocument("users");
  const { filter, document: filteredUser } = useQueries("users");

  useEffect(() => {
    if (cancelled) return;
    if (filteredUser) {
      if (filteredUser.authUser === "user") {
        navigate("/system/homesystem");
      }
    }
    async function loadData() {
      if (auth) {
        try {
          await setUid(auth.uid);
          await setName(auth.name);
          await setEmail(auth.email);
          await setAuthUser(auth.authUser);

          if (auth.profilePicture) {
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
  }, [
    auth,
    uid,
    cancelled,
    filteredUser,
    user.uid,
    authUser,
    navigate,
    photoUrl,
  ]);

  const tooggleFunctionAuthSystem = (e) => {
    e.preventDefault();
    if (tooggleAuthSystem) {
      setTooggleAuthSystem(false);
      setSuccess(false);
      setFormError(false);
    } else {
      setTooggleAuthSystem(true);
    }
  };

  //Civil Status const
  const options = ["admin", "user"];

  const filterUser = async (e) => {
    const field = "uid";
    const demand = user.uid;
    await filter(field, demand);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess(false);

    filterUser();

    if (filteredUser) {
      if (filteredUser.authUser === "user") {
        navigate("/system/homesystem");
      }
    }

    if (auth.uid === user.uid) {
      setFormError(
        "Não é possível alterar a própria permissão! Peça a outro administrador."
      );
      return;
    }

    const data = {
      authUser,
    };

    try {
      updateDocument(id, data);
    } catch (error) {
      console.log(error);
    }

    setSuccess(true);
    // console.log(data);
  };

  return (
    <div className={styles.admin}>
      <SideBar />
      <div className={styles.main}>
        <div className={styles.auth}>
          <div className={styles.userData}>
            <div className={styles.profilePictureAvatar}>
              {!photoUrl ? (
              <img src="https://firebasestorage.googleapis.com/v0/b/vanessaalbuquerquevisagismo.appspot.com/o/images%2Flogo.png?alt=media&token=aa8651c0-fb6b-442e-a218-366ba5f5bb21" alt="Imagem" className={styles.avatar} />
              ):
              (            <img src={photoUrl} alt="Imagem" className={styles.avatar} />)}
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

          <button onClick={tooggleFunctionAuthSystem}>
            Autorização de Sistema
          </button>
          {tooggleAuthSystem && (
            <div className={styles.labelAuth}>
              <form onSubmit={handleSubmit} className={styles.handleAuthForm}>
                <label>
                  <span>
                    Alterar as autorizações de sistema do usuário para:
                  </span>
                  {options.map((option) => (
                    <label key={option} className={styles.radio}>
                      <input
                        type="radio"
                        name="authValue"
                        value={option}
                        checked={authUser === option}
                        onChange={(e) => setAuthUser(e.target.value)}
                      />
                      {option}
                    </label>
                  ))}
                </label>
                {!response.loading && <button className="btn">Editar</button>}
                {response.loading && (
                  <button className="btn" disabled>
                    Aguarde...
                  </button>
                )}
                {formError && (
                  <p className="error">{response.error || formError}</p>
                )}
                {success && (
                  <p className="success">
                    Autorização de sistema atualizada com sucesso!
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAuth;
