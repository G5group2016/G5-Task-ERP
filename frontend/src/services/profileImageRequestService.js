import api from "../api/axios";

export const getProfileRequests =
    async () => {

        const response =
            await api.get(
                "/profile-image-requests"
            );

        return response.data;
    };

export const approveRequest =
    async (id) => {

        const response =
            await api.put(
                `/profile-image-requests/approve/${id}`
            );

        return response.data;
    };

export const rejectRequest =
    async (id) => {

        const response =
            await api.put(
                `/profile-image-requests/reject/${id}`
            );

        return response.data;
    };

export const getMyRequest =
    async () => {

        const response =
            await api.get(
                "/profile-image-requests/my"
            );

        return response.data;
    };

export const uploadProfileImageRequest = async (image) => {
    const formData = new FormData();

    formData.append("image", image);

    const response = await api.post(
        "/profile-image-requests",
        formData
    );

    return response.data;
};