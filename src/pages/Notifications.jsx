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

  const formatSender = (notification) => {
    return (
      notification.sender?.name ||
      notification.user?.name ||
      notification.from?.name ||
      notification.actor?.name ||
      "Someone"
    );
  };

  const formatMessage = (notification) => {
    return (
      notification.message ||
      notification.text ||
      notification.body ||
      notification.description ||
      notification.title ||
      "You have a new notification"
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Notifications</h2>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-600 dark:text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatSender(notification)}</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">{formatMessage(notification)}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Just now"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;