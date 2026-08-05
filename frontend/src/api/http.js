import axios from 'axios'
import i18n from '../languages/i18n';


const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : '';
const rawBaseApi = (process.env.REACT_APP_API_BASE_URL || runtimeOrigin || '').replace(/\/+$/, '');
const baseApi = rawBaseApi
    ? rawBaseApi.includes('/secure/api')
        ? rawBaseApi
        : `${rawBaseApi}/secure/api`
    : '';
const api = axios.create({
    baseURL: baseApi,
    withCredentials: true,
    timeout: 30000,
});

const apiOrigin = new URL(baseApi).origin;
// const mediaBase = `${apiOrigin}/uploads`;
const csrfTokenApi = `${apiOrigin}/csrf-token`;

// Interceptor global para unificar errores del backend
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let msg = 'Ocurrió un error inesperado.';
        if (error.response?.data?.msg) {
            msg = error.response.data.msg;
        } else if (error.response?.data?.message) {
            msg = error.response.data.message;
        } else if (error.response?.data?.error) {
            msg = error.response.data.error;
        } else if (error.message) {
            msg = error.message;
        }

        if (Array.isArray(msg)) {
            msg = msg.join('. ');
        } else if (typeof msg === 'object' && msg !== null) {
            msg = JSON.stringify(msg);
        }

        error.message = i18n.isInitialized ? i18n.t(msg, { defaultValue: msg }) : msg;
        return Promise.reject(error);
    }
);

// Fetch and set CSRF token globally with retries for startup timing issues
async function fetchCsrfToken(retries = 3, delayMs = 500) {
    try {
        const response = await axios.get(csrfTokenApi, { withCredentials: true });
        const { csrfToken } = response.data || {};

        if (csrfToken) {
            api.defaults.headers.common['x-csrf-token'] = csrfToken;
            return csrfToken;
        }

        return null;
    } catch (error) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            return fetchCsrfToken(retries - 1, delayMs * 1.5);
        }

        return null;
    }
}

// Endpoints usuario
const loginApi = `${baseApi}/user/login`
const logoutApi = `${baseApi}/user/logout`
const registerApi = `${baseApi}/user/register`
const userInfoApi = `${baseApi}/user/info`
const updateUserProfileApi = `${baseApi}/user/update-profile`
const changePasswordApi = `${baseApi}/user/change-password`;
const verifyTokenApi = `${baseApi}/user/verify-token`;
const updateTokenStatusApi = `${baseApi}/user/update-token-status`;
const tokenStatusApi = `${baseApi}/user/token-status`;
const resendTokenApi = `${baseApi}/user/resend-token`
const verifyEmailApi = `${baseApi}/user/verify-email`;
const sendVerificationEmailApi = `${baseApi}/user/send-verification-email`;
const isEmailVerifiedApi = `${baseApi}/user/is-email-verified`;
const forgotPasswordApi = `${baseApi}/user/forgot-password`;
const resetPasswordApi = `${baseApi}/user/reset-password`;


// Endpoints de Products
const createProductApi = `${baseApi}/products/create`;
const getProductsApi = `${baseApi}/products/all`;


// Endpoints languages
const languagesApi = `${baseApi}/languages`
const userLanguageApi = `${baseApi}/user/language`

async function get(url, body, config = {}) {
    return await api.get(url, {
        params: body || {},
        ...config
    })
}

// External/public APIs must not send app CSRF headers or cookies.
async function getExternal(url, config = {}) {
    const safeHeaders = { ...(config.headers || {}) };

    return await axios.get(url, {
        ...config,
        withCredentials: false,
        headers: safeHeaders
    });
}

async function post(url, body) {
    const csrfToken = await fetchCsrfToken();
    if (!csrfToken) {
        throw new Error('No se pudo obtener el token CSRF del backend.');
    }
    return await api.post(url, body)
}

async function postMultipart(url, formData) {
    const csrfToken = await fetchCsrfToken();
    if (!csrfToken) {
        throw new Error('No se pudo obtener el token CSRF del backend.');
    }
    return await api.post(url, formData, { timeout: 120000 })
}

async function patch(url, body) {
    const csrfToken = await fetchCsrfToken();
    if (!csrfToken) {
        throw new Error('No se pudo obtener el token CSRF del backend.');
    }
    return await api.patch(url, body)
}

async function del(url) {
    const csrfToken = await fetchCsrfToken();
    if (!csrfToken) {
        throw new Error('No se pudo obtener el token CSRF del backend.');
    }
    return await api.delete(url)
}

export {
    get,
    getExternal,
    post,
    postMultipart,
    patch,
    del,
    fetchCsrfToken,
    // mediaBase,
    // apiOrigin,

    loginApi,
    logoutApi,
    registerApi,
    userInfoApi,
    verifyTokenApi,
    changePasswordApi,
    updateTokenStatusApi,
    tokenStatusApi,
    resendTokenApi,
    updateUserProfileApi,
    verifyEmailApi,
    sendVerificationEmailApi,
    isEmailVerifiedApi,
    forgotPasswordApi,
    resetPasswordApi,
    createProductApi,
    getProductsApi,
    languagesApi,
    userLanguageApi
};
