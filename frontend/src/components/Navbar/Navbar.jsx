import { useEffect, useState } from "react";
import { getNotifications, markAllAsRead } from "../../services/notificationService";

const Navbar = () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    unreadCount,
    setUnreadCount
  ] = useState(0);

  const [
    showNotifications,
    setShowNotifications
  ] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications =
    async () => {

      try {

        const data =
          await getNotifications();

        setNotifications(
          data.notifications
        );

        setUnreadCount(
          data.notifications.filter(
            notification =>
              !notification.isRead
          ).length
        );

      } catch (error) {

        console.log(error);

      }
    };

  const handleNotificationClick =
    async () => {

      setShowNotifications(
        !showNotifications
      );

      try {

        await markAllAsRead();

        setUnreadCount(0);

      } catch (error) {

        console.log(error);

      }
    };

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">

      <h1 className="text-xl font-bold">
        G5 Group ERP
      </h1>

      <div className="flex items-center gap-6">

        {/* Notification Bell */}

        <div className="relative">

          <div className="relative">

            <button
              onClick={
                handleNotificationClick
              }
            >
              🔔
            </button>

            {unreadCount > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full"
              >
                {unreadCount}
              </span>
            )}

          </div>

          {showNotifications && (

            <div className="absolute right-0 mt-3 w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">

              <div className="p-3 border-b border-slate-700 font-bold">
                Notifications
              </div>

              {notifications.length ===
                0 ? (

                <div className="p-4 text-slate-400">
                  No Notifications
                </div>

              ) : (

                notifications.map(
                  (
                    notification
                  ) => (

                    <div
                      key={
                        notification._id
                      }
                      className="p-4 border-b border-slate-700 hover:bg-slate-700"
                    >

                      <h3 className="font-semibold text-yellow-400">
                        {
                          notification.title
                        }
                      </h3>

                      <p className="text-sm whitespace-pre-line mt-2">
                        {
                          notification.message
                        }
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>
                  )
                )

              )}

            </div>

          )}

        </div>

        {/* User */}

        <div>
          <p>
            {user?.fullName}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Navbar;