import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  checkIn,
  checkOut,
  getMyAttendance,
} from "../../services/attendanceService";

const MyAttendance = () => {

  const [records,
    setRecords] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance =
    async () => {

      try {

        const data =
          await getMyAttendance();

        setRecords(data);

      } catch (error) {

        toast.error(
          "Failed to load attendance"
        );

      } finally {

        setLoading(false);

      }
    };

  const handleCheckIn =
    async () => {

      try {

        await checkIn();

        toast.success(
          "Checked In Successfully"
        );

        loadAttendance();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Check In Failed"
        );

      }
    };

  const handleCheckOut =
    async () => {

      try {

        await checkOut();

        toast.success(
          "Checked Out Successfully"
        );

        loadAttendance();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Check Out Failed"
        );

      }
    };

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-4xl font-bold mb-6">
        My Attendance
      </h1>

      <div className="flex gap-4 mb-6">

        <button
          onClick={
            handleCheckIn
          }
          className="bg-green-600 px-5 py-3 rounded"
        >
          Check In
        </button>

        <button
          onClick={
            handleCheckOut
          }
          className="bg-red-600 px-5 py-3 rounded"
        >
          Check Out
        </button>

      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="bg-slate-700">

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Check In
              </th>

              <th className="p-3 text-left">
                Check Out
              </th>

              <th className="p-3 text-left">
                Hours
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {records.map(
              (record) => (

                <tr
                  key={
                    record._id
                  }
                  className="border-t border-slate-700"
                >

                  <td className="p-3">
                    {
                      new Date(
                        record.date
                      ).toLocaleDateString()
                    }
                  </td>

                  <td className="p-3">
                    {
                      record.checkIn
                        ? new Date(
                            record.checkIn
                          ).toLocaleTimeString()
                        : "-"
                    }
                  </td>

                  <td className="p-3">
                    {
                      record.checkOut
                        ? new Date(
                            record.checkOut
                          ).toLocaleTimeString()
                        : "-"
                    }
                  </td>

                  <td className="p-3">
                    {
                      record.totalHours
                    }
                  </td>

                  <td className="p-3">
                    {
                      record.status
                    }
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default MyAttendance;