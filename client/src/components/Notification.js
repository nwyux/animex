import { XCircle } from "lucide-react";

export default function Notification(props) {
  return (
    <div className={`z-20 fixed bottom-0 right-0 m-4 p-4 ${props.color} text-blanc rounded-lg`}>
      <button
        onClick={() => props.setNotification(false)}
        className="flex items-center gap-2"
      >
        <p className=""> {props.message} </p>
        <XCircle />
      </button>
    </div>
  );
}
