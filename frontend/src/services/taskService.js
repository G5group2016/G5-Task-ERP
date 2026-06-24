import api from "../api/axios";

export const getTasks = async (companyId = "") => {
  const response = await api.get(
    `/tasks${companyId ? `?company=${companyId}` : ""}`
  );

  return response.data;
};

export const createTask = async (data) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const getMyTasks =
  async () => {

    const response =
      await api.get(
        "/tasks/my"
      );

    return response.data;
  };


export const updateTaskStatus =
  async (taskId, status) => {

    const response =
      await api.put(
        `/tasks/status/${taskId}`,
        { status }
      );

    return response.data;
  };

export const getLatestTasks =
  async () => {

    const response =
      await api.get(
        "/tasks/latest"
      );

    return response.data;

  };

export const createSelfTask = async (
  taskData
) => {

  const response =
    await api.post(
      "/tasks/self",
      taskData
    );

  return response.data;
};

export const downloadTasksExcel = (
  companyId = ""
) =>
  api.get(
    `/tasks/export/excel${companyId
      ? `?company=${companyId}`
      : ""
    }`,
    {
      responseType: "blob"
    }
  );