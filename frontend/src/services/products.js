import { get, post, createProductApi, getProductsApi } from '../api/http';

export default class Products {

    // CREA UN NUEVO PRODUCTO CON LOS DATOS DEL FORMULARIO
    static async createProduct(body) {
        return await post(createProductApi, body);
    }



    // OBTIENE LOS PRODUCTOS, OPCIONALMENTE FILTRADOS POR BÚSQUEDA
    static async getProducts(query = "") {
        const url = query ? `${getProductsApi}?q=${encodeURIComponent(query)}` : getProductsApi;
        return await get(url, {});
    }
}