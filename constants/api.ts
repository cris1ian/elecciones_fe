const useLocalBackend: boolean = false;

const localhost: string = 'http://192.168.0.6:3002';
const staging: string = 'http://elecciones.kernelinformatica.com.ar:3002';
const production: string = 'http://elecciones.kernelinformatica.com.ar:3002';

export const REST_URL = !__DEV__ ? production :
    useLocalBackend ? localhost : staging;