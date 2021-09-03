
import candidatosTipos from '../constants/candidatos-tipos';
import reglas from '../constants/reglas';
import { MesaCandidato } from '../models/mesa-candidato.model';
import { createTwoButtonAlert } from './AlertsScreens';

/** Valido los datos antes de enviarlos */
export const validarDatos = (mesasCandidatos: MesaCandidato[]): boolean => {

    // Primero compruebo que ningun campo sea nulo, o 0, o texto
    const camposNulos = mesasCandidatos.some((mc: MesaCandidato) => !mc.cantidadVotos || mc.cantidadVotos === 0)

    if (camposNulos) {
        createTwoButtonAlert('Error', `Falta completar algun campo, o alguno es 0`);
        return false
    }

    // RN: Candidato total votos tiene que ser menor o igual a 350
    const candidatoTotalVotos: MesaCandidato | undefined = mesasCandidatos.find(mc => mc.candidato.candidatoTipo === candidatosTipos.TOTAL_VOTOS);

    if (candidatoTotalVotos === undefined || candidatoTotalVotos === null) {
        createTwoButtonAlert('Error', `candidatoTotalVotos no está definido o es null`);
        return false
    }

    if (candidatoTotalVotos.cantidadVotos === undefined || candidatoTotalVotos.cantidadVotos === null) {
        createTwoButtonAlert('Error', `Total de Votos Candidato es null`);
        return false
    }

    if (candidatoTotalVotos.cantidadVotos > reglas.MAX_VOTOS) {
        createTwoButtonAlert('Error', `Total Votos supera la cantidad máxima permitida: ${reglas.MAX_VOTOS}`);
        return false;
    }

    // RN: Sumatoria cnadidatos exceptuando total votos tiene que ser menor o igual a 350
    const sumTotalVotos: number = mesasCandidatos
        .filter(mc => mc.candidato.candidatoTipo !== candidatosTipos.TOTAL_VOTOS && mc.candidato.candidatoTipo !== candidatosTipos.TOTAL_VOTOS_VALIDO)
        .reduce((acc, mc) => acc + Number(mc.cantidadVotos), 0);

    if (sumTotalVotos > reglas.MAX_VOTOS) {
        createTwoButtonAlert('Error', `La suma de los votos de cada candidato supera la cantidad máxima permitida: ${reglas.MAX_VOTOS}`);
        return false
    }

    // RN: Candidato Total Votos Valido tiene que ser <= a Total votos, y >= a la suma de los votos de los candidatos
    const candidatoTotalVotosValido: MesaCandidato | undefined = mesasCandidatos.find(mc => mc.candidato.candidatoTipo === candidatosTipos.TOTAL_VOTOS_VALIDO);

    if (candidatoTotalVotosValido === undefined || candidatoTotalVotosValido === null) {
        createTwoButtonAlert('Error', `candidatoTotalVotos no está definido o es null`);
        return false
    }

    if (candidatoTotalVotosValido.cantidadVotos === undefined || candidatoTotalVotosValido.cantidadVotos === null) {
        createTwoButtonAlert('Error', `Total de Votos Candidato es null`);
        return false
    }

    if (candidatoTotalVotosValido.cantidadVotos > candidatoTotalVotos.cantidadVotos || candidatoTotalVotosValido.cantidadVotos < sumTotalVotos) {
        createTwoButtonAlert('Error', `Total Votos Valido tiene que ser menor o igual a Total votos, y mayor o igual a la suma de los votos de los candidatos`);
        return false;
    }

    return true;
}