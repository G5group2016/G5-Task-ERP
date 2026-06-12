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