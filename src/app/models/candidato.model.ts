export class Candidato {
    id: number;
    nombre: string;
    color: string;
    urlimagen: string;

    constructor(candidato: { id: number, nombre: string, color: string, urlimagen: string }) {
        this.id = candidato.id;
        this.nombre = candidato.nombre;
        this.color = candidato.color;
        this.urlimagen = candidato.urlimagen;
    }
}