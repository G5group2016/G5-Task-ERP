import { useEffect, useState } from "react";
import {
  getNotifications, markAllAsRead, deleteNotification,
  deleteAllNotifications
} from "../../services/notificationService";
import { MdOutlineMail } from "react-icons/md";

const Navbar = () => {

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem("user")
      )
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

  useEffect(() => {

    const refreshUser = () => {

      const latestUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      setUser(latestUser);

    };

    window.addEventListener(
      "storage",
      refreshUser
    );

    return () =>
      window.removeEventListener(
        "storage",
        refreshUser
      );

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

  const handleDeleteNotification =
    async (id) => {

      try {

        await deleteNotification(id);

        loadNotifications();

      } catch (error) {

        console.log(error);

      }
    };

  const handleDeleteAll =
    async () => {

      try {

        await deleteAllNotifications();

        setNotifications([]);

        setUnreadCount(0);

      } catch (error) {

        console.log(error);

      }
    };

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">

      <h1 className="text-xl font-bold">
        G5 Group
      </h1>

      <div className="flex items-center gap-6">
        <button
          onClick={() =>
            window.open(
              "https://outlook.office.com/mail/",
              "_blank"
            )
          }
          title={`Open Mail (${user?.email})`}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-lg cursor-pointer"
        >
          <MdOutlineMail />
        </button>

        {/* Notification Bell */}

        <div className="relative">

          <div className="relative">
            <button className="cursor-pointer"
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
              <div className="p-3 border-b border-slate-700 flex justify-between items-center">

                <span className="font-bold">
                  Notifications
                </span>

                {(user?.role === "SUPER_ADMIN" ||
                  user?.role === "COMPANY_ADMIN") && (

                    <button
                      onClick={handleDeleteAll}
                      className="text-red-400 text-sm cursor-pointer"
                    >
                      Delete All
                    </button>

                  )}

              </div>

              {/* <div className="p-3 border-b border-slate-700 font-bold">
                Notifications
              </div> */}

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

                      {(user?.role === "SUPER_ADMIN" ||
                        user?.role === "COMPANY_ADMIN") && (

                          <button
                            onClick={() =>
                              handleDeleteNotification(
                                notification._id
                              )
                            }
                            className="text-red-400 text-xs mt-2 cursor-pointer"
                          >
                            Delete
                          </button>

                        )}

                    </div>
                  )
                )

              )}

            </div>

          )}



        </div>

        {/* User */}

        {/* User */}

        <div
          className="flex items-center gap-3"
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold"
            >
              {user?.fullName?.charAt(0)}
            </div>
          )}

          <p>
            {user?.fullName}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Navbar;