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

  // export const getMyTeam =
  // async () => {

  //   const response =
  //     await api.get(
  //       "/employees/my-team"
  //     );

  //   return response.data;
  // };