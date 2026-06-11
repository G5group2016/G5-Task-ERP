import api from "../api/axios";

export const getTasks = async () => {
  const response = await api.get("/tasks");
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