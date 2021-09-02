import { AxiosError, AxiosResponse } from "axios";
import { createTwoButtonAlert } from "./AlertsScreens";

/**
 * Error handler
 * @param {AxiosError} error
 */
export const errorCatcher = (error: AxiosError): undefined => {
    console.warn('errorCatcher error.response', error?.response, error, error?.message, error?.request?.result, error?.request?.error?.message, error?.request?.error?.result);
    console.warn('errorCatcher error', error);
    errorHandlerUi(error);
    // return error?.response || error?.request || error?.message || error;
    return
}

/** User Feedback for API Errors */
export const errorHandlerUi = (error: AxiosError | any) => {
    console.log('errorHandlerUi', error.code, error.response, error);
    const message = error.response?.status || error.response?.data || error.message || error.code || error?.error?.message || error?.data?.message || error?.data?.message?.value;

    // console.log('error.response?.data?.error?.code === 301', error.response?.data?.error?.code, error.response?.data?.error?.code === 301);
    // console.log('error.response?.status === 400', error.response?.status, error.response?.status === 400);
    // console.log('error.response?.status === 401', error.response?.status, error.response?.status === 401);
    // console.log('error.response?.status === 504', error.response?.status, error.response?.status === 504);

    if (error.response?.data?.error?.code === 301) return createTwoButtonAlert("Sesión en SAP Vencida", `Aguarde unos momentos...`);
    if (error.response?.status === 400) return createTwoButtonAlert("Error al intentar realizar esta operación.", `Intente nuevamente en unos minutos. Si el error persiste comunicarse con su representante comercial.`);
    if (error.response?.status === 401) return createTwoButtonAlert("No encontrado", `Verifique los datos enviados`);
    if (error.response?.status === 404) return createTwoButtonAlert("No encontrado", `Verifique los datos enviados`);
    if (error.response?.status === 504) return createTwoButtonAlert("El servidor tardó demasiado en responder", `Reintente en unos momentos...`);
    return createTwoButtonAlert("Algo salió mal!", `${message || 'Error de red desconocido'}`);

    // Error 400 - 
    // Error 401 - 

    /** Personalizar mensajes de error segun el codigo para que al usuario le llegue algo entendible */
}