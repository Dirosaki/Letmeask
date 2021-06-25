import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-modal";

// import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";

import { RoomCode } from "../../components/RoomCode";
import { Button } from "../../components/Button";
import { Question } from "../../components/Question";

import { database } from "../../services/firebase";

import logoImg from "../../assets/images/logo.svg";
import emptyQuestionImg from "../../assets/images/empty-questions.svg";
import closeImg from "../../assets/images/close.svg";

import "./style.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [modalType, setModalType] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true);

  // const { user } = useAuth();

  const history = useHistory();
  const { questions, title } = useRoom(roomId);

  function closeModal() {
    setModalIsOpen(false);
  }

  async function handleEndRoom() {
    setModalType("close");
    setModalIsOpen(true);
    if (window.confirm("Você tem certeza que deseja encerrar essa sala?")) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });

      history.push("/");
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    setModalType("exclude");
    if (window.confirm("Você tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        {questions.length === 0 && (
          <div className="empty-questions">
            <img src={emptyQuestionImg} alt="" />
            <strong>Nenhuma pergunta por aqui...</strong>
            <p>
              Envie o código desta sala para seus amigos e<br /> comece a
              responder perguntas!
            </p>
          </div>
        )}
        <div className="question-list">
          {questions.map((question) => (
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
            >
              <button
                type="button"
                className="delete-question"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 5.99988H5H21"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Question>
          ))}
        </div>
      </main>
      <Modal
        className="modal"
        overlayClassName="modal-overlay"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        ariaHideApp={false}
      >
        <img src={closeImg} alt="Close" />
        <strong>
          {modalType === "exclude" ? "Excluir pergunta" : "Encerrar sala"}
        </strong>
        <p>
          {modalType === "exclude"
            ? "Tem certeza que você deseja excluir essa pergunta?"
            : "Tem certeza que você deseja encerrar esta sala?"}
        </p>
        <footer>
          <button className="cancel" onClick={closeModal}>
            Cancelar
          </button>
          <button className="confirm" onClick={closeModal}>
            Sim, {modalType === "exclude" ? "excluir" : "encerrar"}
          </button>
        </footer>
      </Modal>
    </div>
  );
}