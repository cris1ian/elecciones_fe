import { REST_URL } from "../constants/api";
import axios, { AxiosError, AxiosResponse } from "axios"
import { errorCatcher } from "../utils/ErrorHandlerUi";
import { Mesa } from "../models/mesa.model";
import { PuntoMuestral, PuntoMuestralRaw } from "../models/punto-muestral.model";
import { Candidato } from "../models/candidato.model";
import { Categoria } from "../models/categoria.model";
import { MesaCandidato } from "../models/mesa-candidato.model";
import { Resultado } from "../models/resultado.model";


/**
 * Retorna un Observable con todas las categorias
 */
export const getCategoriasByMesaAndPuntoMuestral = async (idPuntoMuestral: number, mesa: Mesa): Promise<Categoria[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas/${mesa.id}/categorias`;

    try {
        const resp: AxiosResponse<any> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        return resp.data
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get<Categoria[]>(
    //     // `${REST_URL}/categoria`
    //     `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas/${mesa.id}/categorias`
    // )
}

/**
 * Retorna un Observable con todas las mesas de un punto muestral dado
 */
export const getMesasByPuntoMuestral = async (idPuntoMuestral: number): Promise<Mesa[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas`;

    try {
        const resp: AxiosResponse<Mesa[]> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        return resp.data
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get<Mesa[]>(
    //     `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas`
    // )
}

/**
 * Retorna un Observable el puntoMuestral dado un celular
 */
export const getPuntoMuestralByCelular = async (celular: string): Promise<PuntoMuestralRaw[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${celular}`;

    try {
        const resp: AxiosResponse<PuntoMuestralRaw[]> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        return resp.data
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get<PuntoMuestral[]>(
    //     `${REST_URL}/punto_muestral/${celular}`
    // )
}

/**
 * Retorna un Observable los candidatos dada una categoria
 */
export const getCandidatosByCategoria = async (idCategoria: number): Promise<Candidato[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/categoria/${idCategoria}/candidatos`;

    try {
        const resp: AxiosResponse<Candidato[]> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        return resp.data
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get<Candidato[]>(
    //     `${REST_URL}/categoria/${idCategoria}/candidatos`
    // )
}

/**
 * Inseta en la db todos los nuevos mesasCandidatos
 */
export const postMesasCandidatos = async (mesasCandidatos: MesaCandidato[], imgBlob: any, mesa: Mesa, categoria: Categoria): Promise<any> => {
    const ENDPOINT: string = `${REST_URL}/mesa-candidato/${mesa.descripcion}/${categoria.descripcion}`;

    const formData = new FormData();

    formData.append('attachment', imgBlob);
    formData.append('mesasCandidatos', JSON.stringify(mesasCandidatos));

    try {
        const resp: AxiosResponse<any> = await axios.post(ENDPOINT, formData);
        console.log(`${ENDPOINT}`, resp);
        return resp.data
    } catch (error) {
        return errorCatcher(error)
    }

    // return {
    //     this.http.post(`${REST_URL}/mesa-candidato/${mesa.descripcion}/${categoria.descripcion}`, formData);
    // }
}

/**
 * Retorna un Observable con los resultados
 */
export const getResultados = async (idCategoria: any, idMesa: any): Promise<Resultado[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/resultados/${idCategoria}/${idMesa}`;

    try {
        const resp: AxiosResponse<Resultado[]> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        const _mappedResp: Resultado[] = resp.data.map((elem: any) => new Resultado(elem));
        return _mappedResp
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get<any[]>(
    //     `${REST_URL}/resultados/${idCategoria}/${idMesa}`
    // ).pipe(
    //     map((resp: any) => resp.map(a => new Resultado(a)))
    // )
}

/**
 * Retorna TODAS las categorias en un Observable
 */
export const getAllCategorias = async (): Promise<Categoria[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/categorias`;

    try {
        const resp: AxiosResponse<Categoria[]> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        return resp.data
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get<Categoria[]>(
    //     `${REST_URL}/categorias`
    // )
}

/**
 * Retorna TODAS las mesas en un Observable
 */
export const getAllMesas = async (): Promise<Mesa[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/mesas`;

    try {
        const resp: AxiosResponse<any> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        return resp.data
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get<Mesa[]>(
    //     `${REST_URL}/mesas`
    // )
}

/**
 * Reportar presencia
 */
export const setRegistroIngreso = async (celular: string, newRegistroIngreso: boolean) => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${celular}`;
    const body: any = { registroIngreso: newRegistroIngreso ? 1 : 0 };

    try {
        const resp: AxiosResponse<any> = await axios.post('news', body);
        console.log(`${ENDPOINT}`, resp);
        return resp
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.post(
    //     `${REST_URL}/punto_muestral/${celular}`,
    //     {
    //         registroIngreso: newRegistroIngreso ? 1 : 0
    //     }
    // )
}

/**
 * 
 */
export const getPuntosInformados = async (idCategoria: number): Promise<string | undefined> => {
    const ENDPOINT: string = `${REST_URL}/puntos-informados/${idCategoria}`;

    try {
        const resp: AxiosResponse<any> = await axios.get(ENDPOINT);
        console.log(`${ENDPOINT}`, resp);
        const _mappedResp: string = resp.data.map((resp: any[]) => (resp && resp.length > 0) ? resp[0][''] : '');
        return _mappedResp
        // return resp
    } catch (error) {
        return errorCatcher(error)
    }

    // this.http.get(
    //     `${REST_URL}/puntos-informados/${idCategoria}`
    // ).pipe(
    //     map(
    //         (resp: any[]) => resp && resp.length > 0 ?
    //             resp[0][''] : ''
    //     )
    // )
}