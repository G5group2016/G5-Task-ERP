import api from "../api/axios";

export const getCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

export const createCompany = async (data) => {
  const response = await api.post(
    "/companies",
    data
  );

  return response.data;
};