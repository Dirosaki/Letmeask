import toast, { Toaster } from "react-hot-toast";

import copyImg from "../../assets/images/copy.svg";

import "./style.scss";

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  }

  return (
    <>
      <button className="room-code" onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="Copiar código da sala" />
        </div>
        <span>Sala {code}</span>
      </button>
      <Toaster />
    </>
  );
}
