import api from "../api/axios";

export const getEmployees = async () => {
  const response = await api.get(
    "/employees"
  );

  return response.data;
};

export const createEmployee =
  async (data) => {
    const response =
      await api.post(
        "/employees",
        data
      );

    return response.data;
  };

export const disableEmployee = async (id) => {
  const response = await api.put(
    `/employees/disable/${id}`
  );

  return response.data;
};

export const toggleEmployeeStatus =
  async (id) => {

    const response =
      await api.put(
        `/employees/status/${id}`
      );

    return response.data;
  };

export const getEmployee = async (id) => {
  const response = await api.get(
    `/employees/${id}`
  );

  return response.data;
};

export const getEmployeeAuditLogs =
  async (id) => {

    const response =
      await api.get(
        `/auth/audit/${id}`
      );

    return response.data;
  };

export const getEmployeeTasks =
  async (id) => {

    const response =
      await api.get(
        `/employees/${id}/tasks`
      );

    return response.data;
  };

export const getEmployeeAttendance =
  async (id) => {

    const response =
      await api.get(
        `/employees/${id}/attendance`
      );

    return response.data;
  };

export const getEmployeeReports =
  async (id) => {

    const response =
      await api.get(
        `/employees/${id}/reports`
      );

    return response.data;
  };

export const resetEmployeePassword =
  async (id) => {

    const response =
      await api.put(
        `/employees/reset-password/${id}`
      );

    return response.data;

  };

export const changeEmployeeRole =
  async (id, role) => {

    const response =
      await api.put(
        `/employees/role/${id}`,
        { role }
      );

    return response.data;

  };
