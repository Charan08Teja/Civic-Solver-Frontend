import { useEffect, useState } from "react";
import API from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await API.get("/issues/notifications");
      setNotifications(res.data);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      {notifications.map((n) => (
        <div key={n.id} className="bg-white p-3 mb-2 rounded shadow">
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;