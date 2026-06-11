import api from "../api/axios";

export const getDashboardStats =
async () => {
  const response =
    await api.get(
      "/dashboard/stats"
    );

  return response.data;
};

export const getEmployeeDashboard =
async () => {

  const response =
    await api.get(
      "/dashboard/employee"
    );

  return response.data;
};

export const getCompanyAdminDashboard =
async () => {

  const response =
    await api.get(
      "/dashboard/company-admin"
    );

  return response.data;
};