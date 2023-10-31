import axiosInstance from "./api";
const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = store.state.token;
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;
            if (originalConfig.url !== "/login" && err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    window.location = '/logout';
                }
            }
            return Promise.reject(err);
        }
    );
};

export default setup;