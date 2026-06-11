import { useEffect, useState } from "react";
import { getMyTeam } from "../../services/employeeService";
import toast from "react-hot-toast";

const TeamMembers = () => {

  const [employees, setEmployees] =
    useState([]);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {

      const data =
        await getMyTeam();

      setEmployees(
        data.employees
      );

    } catch {

      toast.error(
        "Failed to load team"
      );

    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-6">
        My Team
      </h1>

      <div className="bg-slate-800 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="bg-slate-900">

              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Designation
              </th>

              <th className="p-4">
                Department
              </th>

            </tr>

          </thead>

          <tbody>

            {employees.map(
              (employee) => (
                <tr
                  key={employee._id}
                  className="border-t border-slate-700"
                >

                  <td className="p-4">
                    {employee.fullName}
                  </td>

                  <td className="p-4">
                    {employee.email}
                  </td>

                  <td className="p-4">
                    {employee.designation}
                  </td>

                  <td className="p-4">
                    {employee.department}
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

export default TeamMembers;