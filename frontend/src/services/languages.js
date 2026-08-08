import { get, patch, languagesApi, userLanguageApi } from '../api/http';

export default class LanguagesService {

    // OBTIENE UN IDIOMA ESPECÍFICO POR SU CÓDIGO
    static async getLanguage(lang) {
        return await get(`${languagesApi}/${lang}`);
    }



    // OBTIENE TODOS LOS IDIOMAS DISPONIBLES
    static async getAllLanguages() {
        return await get(languagesApi);
    }



    // OBTIENE EL IDIOMA CONFIGURADO DEL USUARIO
    static async getUserLanguage() {
        return await get(userLanguageApi);
    }



    // ACTUALIZA EL IDIOMA DEL USUARIO
    static async updateUserLanguage(language) {
        return await patch(userLanguageApi, { language });
    }
}
