import api from "../api/axios";

export const searchUsers = async (search) => {
  const response = await api.get(
    `/chat/users/search?search=${search}`
  );

  return response.data;
};

export const createChat = async (userId) => {
  const response = await api.post(
    "/chat",
    { userId }
  );

  return response.data;
};

export const getMyChats = async () => {
  const response = await api.get(
    "/chat"
  );

  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(
    `/chat/messages/${chatId}`
  );

  return response.data;
};

export const sendMessage = async (
  chatId,
  content
) => {
  const response = await api.post(
    `/chat/messages/${chatId}`,
    { content }
  );

  return response.data;
};