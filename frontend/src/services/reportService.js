import api from "../api/axios";

export const getReports = async () => {
  const response = await api.get(
    "/work-reports"
  );

  return response.data;
};

export const getMyReports =
  async () => {
    const response =
      await api.get(
        "/work-reports/my"
      );

    return response.data;
  };

export const submitReport =
  async (data) => {
    const response =
      await api.post(
        "/work-reports",
        data
      );

    return response.data;
  };

export const downloadReportsExcel =
  async () => {

    const response =
      await api.get(
        "/work-reports/export-excel",
        {
          responseType: "blob",
        }
      );

    return response;
  };