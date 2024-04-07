import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import styles from "./Data.module.css";
import { useQueries } from "../../hooks/useQueries";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import {
  collection,
  getDocs,
  query,
  where,
  snapshotEqual,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const ResumeData = ({ isOpen, setModalOpen }) => {
  //const render
  const [cancelled, setCancelled] = useState("");
  const [loading, setLoading] = useState(false);
  const [tooggleInitialForm, setTooggleInitialForm] = useState(false);
  const [conclusions, setConclusions] = useState();
  //const auth
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState(
    "https://firebasestorage.googleapis.com/v0/b/vmavisagismo.appspot.com/o/logobremoved.png?alt=media&token=e259ce3f-06bd-4e9a-9429-3e1a85a3eb99"
  );
  //const document
  const [uidDocument, setUidDocument] = useState("");
  const [nameDocument, setNameDocument] = useState("");
  const [emailDocument, setEmailDocument] = useState("");
  const [photoUrlDocument, setPhotoUrlDocument] = useState(
    "https://firebasestorage.googleapis.com/v0/b/vmavisagismo.appspot.com/o/logobremoved.png?alt=media&token=e259ce3f-06bd-4e9a-9429-3e1a85a3eb99"
  );
  //const search
  const { id } = useParams();
  const { document: auth } = useFetchDocument("users", id);

  useEffect(() => {
    if (auth) {
      console.log(auth.uid);
      setUid(auth.uid);
    }

    return () => {};
  }, [auth]);

  const { documents: firstImages } = useFetchDocuments("firstImages", uid);

  const { filter: filterPersonalData, document: filteredPersonalData } =
    useQueries("personaldata");
  const { filter: filterContactData, document: filteredContactData } =
    useQueries("contactdata");
  const { filter: filterAboutMe, document: filteredAboutMe } =
    useQueries("aboutme");
  const { filter: filterPersonalAnalysis, document: filteredPersonalAnalysis } =
    useQueries("personalanalysis");
  const { filter: filterLifeStyle, document: filteredLifeStyle } =
    useQueries("lifestyle");
  const { filter: filterBodyMeasurement, document: filteredBodyMeasurement } =
    useQueries("bodyMeasurement");
  const { filter: filterHealth, document: filteredHealth } =
    useQueries("health");
  const { filter: filterPersonalStyle, document: filteredPersonalStyle } =
    useQueries("personalstyle");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      if (cancelled) return;

      if (auth) {
        await setUid(auth.uid);
        await setName(auth.name);
        await setEmail(auth.email);
        if (auth.profilePicture) {
          await setPhotoUrl(auth.profilePicture);
        }
      }
    }

    loadData();

    return () => setCancelled(true);
  }, [cancelled, auth, loading, uid]);

  useEffect(() => {
    async function loadConclusion() {
      const q = query(collection(db, "conclusion"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      setConclusions(querySnapshot.docs.map((doc) => doc.data()));
    }

    loadConclusion();

    return () => {};
  }, [uid]);


  console.log(uid);
  console.log(conclusions);
  console.log(nameDocument);

  const handleClickInitialForm = async () => {
    await setLoading(true);

    const field = "uid";
    const demand = uid;
    await filterPersonalData(field, demand);
    await filterContactData(field, demand);
    await filterAboutMe(field, demand);
    await filterPersonalAnalysis(field, demand);
    await filterLifeStyle(field, demand);
    await filterBodyMeasurement(field, demand);
    await filterHealth(field, demand);
    await filterPersonalStyle(field, demand);
    setLoading(false);
    setTooggleInitialForm(true);
  };

  const handleSubmitInitialForm = (e) => {
    e.preventDefault();

    handleClickInitialForm();
    if (loading) {
      return <p>Carregando...</p>;
    }
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();

    navigate("/");
    if (loading) {
      return <p>Carregando...</p>;
    }
  };

  const closeInitialForm = (e) => {
    e.preventDefault();
    setTooggleInitialForm(false);
  };

  if (isOpen) {
    return (
      <div className={styles.background} key={id}>
        {!tooggleInitialForm && (
          <>
            <button onClick={setModalOpen}>Fechar</button>
            {conclusions &&
              conclusions.map((data) => (
                <div className={styles.buttonInitialForm} key={data.id}>
                  <div className={styles.formName}>{data.form}</div>
                  <div className={styles.conclusionDate}>
                    Criado em &nbsp;
                    {data.conclusionDate}
                  </div>
                  <div className={styles.button}>
                    {loading && <button disabled>Carregando...</button>}

                    {data.form === "Formulário Inicial" && (
                      <>
                        {!loading && (
                          <button onClick={handleSubmitInitialForm}>
                            Visualizar
                          </button>
                        )}
                      </>
                    )}
                    {data.form === "teste" && (
                      <>
                        {!loading && (
                          <button onClick={handleSubmitTest}>Visualizar</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
          </>
        )}

        {tooggleInitialForm && (
          <div className={styles.resumeData}>
            <button onClick={closeInitialForm}>Fechar</button>
            <div className={styles.mainData}>
              <div className={styles.profilePictureAvatar}>
                <img
                  src={photoUrlDocument}
                  alt="Imagem"
                  className={styles.avatar}
                />
              </div>
              <div className={styles.mainDataTopic}>
                {filteredPersonalData && (
                  <>
                    <div className={styles.title}>
                      <h3>Dados Pessoais</h3>
                    </div>
                    <div className={styles.module}>
                      <p>
                        <span>Nome:&nbsp;</span>
                        {nameDocument}
                      </p>
                      <p>
                        <span>Data de Nascimento:&nbsp;</span>
                        {!filteredPersonalData.birthDate && "Não informado."}
                        {filteredPersonalData.birthDate}
                      </p>
                      <p>
                        <span>Ocupação:&nbsp;</span>
                        {!filteredPersonalData.occupation && "Não informado."}
                        {filteredPersonalData.occupation}
                      </p>
                      <p>
                        <span>Estado Civil:&nbsp;</span>
                        {!filteredPersonalData.civilStatus && "Não informado."}
                        {filteredPersonalData.civilStatus}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.mainDataTopic}>
                {filteredContactData && (
                  <>
                    <div className={styles.title}>
                      <h3>Dados de Contato</h3>
                    </div>
                    <div className={styles.module}>
                      <p>
                        <span>Email:&nbsp;</span>
                        {emailDocument}
                      </p>
                      <p>
                        <span>Telefone:&nbsp;</span>
                        {!filteredContactData.phoneNumber && "Não informado."}
                        {filteredContactData.phoneNumber}
                      </p>
                      <p>
                        <span>Instagram:&nbsp;</span>
                        {!filteredContactData.instagram && "Não informado."}
                        {filteredContactData.instagram}
                      </p>
                      <p>
                        <span>Linkedin:&nbsp;</span>
                        {!filteredContactData.linkedin && "Não informado."}
                        {filteredContactData.linkedin}
                      </p>
                      <p>
                        <span>Facebook:&nbsp;</span>
                        {!filteredContactData.facebook && "Não informado."}
                        {filteredContactData.facebook}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {filteredAboutMe && (
              <>
                <div className={styles.title}>
                  <h3>Quem Eu Sou</h3>
                </div>
                <div className={styles.module}>
                  <p>
                    <span>Análise Pessoal::&nbsp;</span>
                    {!filteredAboutMe.personalRevew && "Não informado."}
                    {filteredAboutMe.personalRevew}
                  </p>
                  <p>
                    <span>Análise Profissional:&nbsp;</span>
                    {!filteredAboutMe.profissionalRevew && "Não informado."}
                    {filteredAboutMe.profissionalRevew}
                  </p>
                  <p>
                    <span>Análise Social:&nbsp;</span>
                    {!filteredAboutMe.socialRevew && "Não informado."}
                    {filteredAboutMe.socialRevew}
                  </p>
                  <p>
                    <span>Sabe enfrentar situações distintas?:&nbsp;</span>
                    {!filteredAboutMe.facingSituations && "Não informado."}
                    {filteredAboutMe.facingSituations}
                  </p>
                  <p>
                    <span>
                      O que você gostaria de transmitir com a sua imagem?&nbsp;
                    </span>
                    {!filteredAboutMe.imageConvey && "Não informado."}
                    {filteredAboutMe.imageConvey}
                  </p>
                  <p>
                    <span>
                      O que te motivou a fazer a consultoria visagista?&nbsp;
                    </span>
                    {!filteredAboutMe.reasonForConsultancy && "Não informado."}
                    {filteredAboutMe.reasonForConsultancy}
                  </p>
                  <p>
                    <span>
                      O que voce espera da consultoria visagista?&nbsp;
                    </span>
                    {!filteredAboutMe.consultancyExpectations &&
                      "Não informado."}
                    {filteredAboutMe.consultancyExpectations}
                  </p>
                </div>
              </>
            )}
            {filteredPersonalAnalysis && (
              <>
                <div className={styles.title}>
                  <h3>Como Eu Me Vejo</h3>
                </div>
                <div className={styles.module}>
                  <p>
                    <span>Como voce avalia o seu corpo desnudo? :&nbsp;</span>
                    {!filteredPersonalAnalysis.nakedBody && "Não informado."}
                    {filteredPersonalAnalysis.nakedBody}
                  </p>
                  <p>
                    <span>
                      Como voce avalia o seu corpo vestido formalmente? &nbsp;
                    </span>
                    {!filteredPersonalAnalysis.formallyDressed &&
                      "Não informado."}
                    {filteredPersonalAnalysis.formallyDressed}
                  </p>
                  <p>
                    <span>
                      Como voce avalia o seu corpo vestido informalmente? &nbsp;
                    </span>
                    {!filteredPersonalAnalysis.informallyDressed &&
                      "Não informado."}
                    {filteredPersonalAnalysis.informallyDressed}
                  </p>
                  <p>
                    <span>Como voce avalia o seu rosto maquiado? :&nbsp;</span>
                    {!filteredPersonalAnalysis.faceMakeup && "Não informado."}
                    {filteredPersonalAnalysis.faceMakeup}
                  </p>
                  <p>
                    <span>
                      Como voce avalia o seu rosto sem maquiagem?&nbsp;
                    </span>
                    {!filteredPersonalAnalysis.cleanFace && "Não informado."}
                    {filteredPersonalAnalysis.cleanFace}
                  </p>
                  <p>
                    <span>Quando exposto ao sol como sua pele fica?&nbsp;</span>
                    {!filteredPersonalAnalysis.sunExposedSkin &&
                      "Não informado."}
                    {filteredPersonalAnalysis.sunExposedSkin}
                  </p>
                </div>
              </>
            )}
            {filteredLifeStyle && (
              <>
                <div className={styles.title}>
                  <h3>Estilo de Vida</h3>
                </div>
                <div className={styles.module}>
                  <p>
                    <span>
                      Você Fuma (cigarro eletrônico, cigarro normal ou
                      narguile)? Se sim, qual e com frequência?:&nbsp;
                    </span>
                    {!filteredLifeStyle.smoke && "Não informado."}
                    {filteredLifeStyle.smoke}
                  </p>
                  <p>
                    <span>
                      Você consome bebidas alcoólicas? Se sim, com qual
                      frequência?&nbsp;
                    </span>
                    {!filteredLifeStyle.alcohol && "Não informado."}
                    {filteredLifeStyle.alcohol}
                  </p>
                  <p>
                    <span>
                      Voce faz atividades físicas? Se sim, com qual frequência e
                      quais exercícios. &nbsp;
                    </span>
                    {!filteredLifeStyle.physicalExercise && "Não informado."}
                    {filteredLifeStyle.physicalExercise}
                  </p>
                  <p>
                    <span>
                      Voce possui tatuagens. Se sim, quantas e em qual região do
                      corpo. :&nbsp;
                    </span>
                    {!filteredLifeStyle.tattoos && "Não informado."}
                    {filteredLifeStyle.tattoos}
                  </p>
                </div>
              </>
            )}
            {filteredBodyMeasurement && (
              <>
                <div className={styles.title}>
                  <h3>Medidas</h3>
                </div>
                <div className={styles.module}>
                  <p>
                    <span>
                      Medida do Ombro (Medir a circunferência)::&nbsp;
                    </span>
                    {!filteredBodyMeasurement.shoulderMeasure &&
                      "Não informado."}
                    {filteredBodyMeasurement.shoulderMeasure}
                  </p>
                  <p>
                    <span>
                      Medida da Cintura (2 dedos acima do umbigo):&nbsp;
                    </span>
                    {!filteredBodyMeasurement.waistMeasure && "Não informado."}
                    {filteredBodyMeasurement.waistMeasure}
                  </p>
                  <p>
                    <span>
                      Medida do Quadril (Circunferência - meio do bumbum):
                      &nbsp;
                    </span>
                    {!filteredBodyMeasurement.hipMeasure && "Não informado."}
                    {filteredBodyMeasurement.hipMeasure}
                  </p>
                </div>
              </>
            )}
            {filteredHealth && (
              <>
                <div className={styles.title}>
                  <h3>Saúde</h3>
                </div>
                <div className={styles.module}>
                  <p>
                    <span>Voce possui alguma patologia?&nbsp;</span>
                    {!filteredHealth.pathologies && "Não informado."}
                    {filteredHealth.pathologies}
                  </p>
                  <p>
                    <span>Como é sua alimentação?&nbsp;</span>
                    {!filteredHealth.dietLike && "Não informado."}
                    {filteredHealth.dietLike}
                  </p>
                  <p>
                    <span>
                      Faz alguma dieta relacionada à alguma patologia? &nbsp;
                    </span>
                    {!filteredHealth.dietPathologies && "Não informado."}
                    {filteredHealth.dietPathologies}
                  </p>
                  <p>
                    <span>Faz uso de medicamentos? Se Sim, quais? &nbsp;</span>
                    {!filteredHealth.medicines && "Não informado."}
                    {filteredHealth.medicines}
                  </p>
                  <p>
                    <span>
                      Voce possui alguma alergia? Se Sim, Descreva-as! &nbsp;
                    </span>
                    {!filteredHealth.allergies && "Não informado."}
                    {filteredHealth.allergies}
                  </p>
                  <p>
                    <span>
                      Voce faz algum tratamento estético? Se Sim, descreva-os?
                      &nbsp;
                    </span>
                    {!filteredHealth.estheticTreatment && "Não informado."}
                    {filteredHealth.estheticTreatment}
                  </p>
                  <p>
                    <span>
                      Voce já fez alguma intervenção cirúrgica (estética ou
                      não)? Se Sim, quais? &nbsp;
                    </span>
                    {!filteredHealth.surgery && "Não informado."}
                    {filteredHealth.surgery}
                  </p>
                  <p>
                    <span>
                      Voce faz uso de alguma prótese? Se sim, quais? &nbsp;
                    </span>
                    {!filteredHealth.prosthetic && "Não informado."}
                    {filteredHealth.prosthetic}
                  </p>
                  <p>
                    <span>
                      Voce faz algum tratamento dentário? Se sim, quais? &nbsp;
                    </span>
                    {!filteredHealth.dentalTreatment && "Não informado."}
                    {filteredHealth.dentalTreatment}
                  </p>
                </div>
              </>
            )}
            {filteredPersonalStyle && (
              <>
                <div className={styles.title}>
                  <h3>Estilo Pessoal</h3>
                </div>
                <div className={styles.module}>
                  <p>
                    <span>Qual cor prefere?&nbsp;</span>
                    {!filteredPersonalStyle.color && "Não informado."}
                    {filteredPersonalStyle.color}
                  </p>
                  <p>
                    <span>
                      Gosta de brilho, transparências, decotes, fendas?&nbsp;
                    </span>
                    {!filteredPersonalStyle.detailsStyle && "Não informado."}
                    {filteredPersonalStyle.detailsStyle}
                  </p>
                  <p>
                    <span>Usa acessórios? Quais mais gosta? &nbsp;</span>
                    {!filteredPersonalStyle.accessories && "Não informado."}
                    {filteredPersonalStyle.accessories}
                  </p>
                  <p>
                    <span>
                      Prefere se vestir no verão ou no inverno? Explique o
                      porquê. &nbsp;
                    </span>
                    {!filteredPersonalStyle.seasons && "Não informado."}
                    {filteredPersonalStyle.seasons}
                  </p>
                  <p>
                    <span>Prefere tênis ou salto? &nbsp;</span>
                    {!filteredPersonalStyle.shoes && "Não informado."}
                    {filteredPersonalStyle.shoes}
                  </p>
                  <p>
                    <span>
                      Usa maquiagem com frequência ou está sempre sem? &nbsp;
                    </span>
                    {!filteredPersonalStyle.makeup && "Não informado."}
                    {filteredPersonalStyle.makeup}
                  </p>
                  <p>
                    <span>Como você classificaria seu estilo? &nbsp;</span>
                    {!filteredPersonalStyle.style && "Não informado."}
                    {filteredPersonalStyle.style}
                  </p>
                </div>
              </>
            )}
            {firstImages && (
              <>
                <div className={styles.title}>
                  <h3>Fotos Corporais</h3>
                </div>

                <div className={styles.grid}>
                  {firstImages &&
                    firstImages.map((data) => (
                      <div className={styles.imagesModule} key={data.id}>
                        <div className={styles.imagesModuleItem}>
                          {data.typeChoiced === "facefront" && (
                            <>
                              <span>Rosto - Frente</span>

                              <img
                                src={data.image}
                                className={styles.imagepreview}
                                alt={`imagem ${data.typeChoiced}`}
                              />
                            </>
                          )}
                        </div>

                        <div className={styles.imagesModuleItem}>
                          {data.typeChoiced === "faceSide" && (
                            <>
                              <span>Rosto - Perfil</span>

                              <img
                                src={data.image}
                                className={styles.imagepreview}
                                alt={`imagem ${data.typeChoiced}`}
                              />
                            </>
                          )}
                        </div>
                        <div className={styles.imagesModuleItem}>
                          {data.typeChoiced === "nape" && (
                            <>
                              <span>Nuca</span>

                              <img
                                src={data.image}
                                className={styles.imagepreview}
                                alt={`imagem ${data.typeChoiced}`}
                              />
                            </>
                          )}
                        </div>
                        <div className={styles.imagesModuleItem}>
                          {data.typeChoiced === "bodyFront" && (
                            <>
                              <span>Corpo - Frente</span>

                              <img
                                src={data.image}
                                className={styles.imagepreview}
                                alt={`imagem ${data.typeChoiced}`}
                              />
                            </>
                          )}
                        </div>
                        <div className={styles.imagesModuleItem}>
                          {data.typeChoiced === "bodySide" && (
                            <>
                              <span>Corpo - Perfil</span>

                              <img
                                src={data.image}
                                className={styles.imagepreview}
                                alt={`imagem ${data.typeChoiced}`}
                              />
                            </>
                          )}
                        </div>
                        <div className={styles.imagesModuleItem}>
                          {data.typeChoiced === "bodyBack" && (
                            <>
                              <span>Corpo - Costas</span>

                              <img
                                src={data.image}
                                className={styles.imagepreview}
                                alt={`imagem ${data.typeChoiced}`}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default ResumeData;
