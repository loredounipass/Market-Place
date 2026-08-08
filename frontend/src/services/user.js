import {
    get,
    post,
    patch,
    registerApi,
    loginApi,
    logoutApi,
    userInfoApi,
    verifyTokenApi,
    changePasswordApi,
    updateTokenStatusApi,
    resendTokenApi,
    updateUserProfileApi,
    sendVerificationEmailApi,
    verifyEmailApi,
    isEmailVerifiedApi
    
} from '../api/http';

export default class User {

    // REGISTRA UN NUEVO USUARIO
    static async register(body) {
        return await post(registerApi, body);
    }



    // INICIA SESIÓN DEL USUARIO
    static async login(body) {
        return await post(loginApi, body);
    }



    // VERIFICA EL TOKEN DE AUTENTICACIÓN DE DOS FACTORES
    static async verifyToken(body) {
        return await post(verifyTokenApi, body);
    }



    // CIERRA LA SESIÓN DEL USUARIO
    static async logout() {
        return await post(logoutApi, {});
    }



    // OBTIENE LA INFORMACIÓN DEL USUARIO AUTENTICADO
    static async getInfo() {
        return await get(userInfoApi, {});
    }



    // CAMBIA LA CONTRASEÑA DEL USUARIO
    static async changePassword(body) {
        return await post(changePasswordApi, body);
    }



    // ACTUALIZA EL ESTADO DEL TOKEN DE AUTENTICACIÓN DE DOS FACTORES
    static async updateTokenStatus(body) { 
        return await patch(updateTokenStatusApi, body);
    }



    // REENVÍA EL TOKEN DE VERIFICACIÓN
    static async resendToken(body) {
        return await post(resendTokenApi, body);
    }



    // ACTUALIZA EL PERFIL DEL USUARIO
    static async updateProfile(body) {
        return await post(updateUserProfileApi, body);
    }



    // VERIFICA EL CORREO ELECTRÓNICO DEL USUARIO
    static async verifyEmail(body) {
        return await post(verifyEmailApi, body);
    }



    // ENVÍA UN CORREO DE VERIFICACIÓN AL USUARIO
    static async sendVerificationEmail(body) {
        return await post(sendVerificationEmailApi, body);
    }



    // COMPRUEBA SI EL CORREO ELECTRÓNICO ESTÁ VERIFICADO
    static async isEmailVerified(body) {
        return await get(isEmailVerifiedApi, body);
    }
    
}