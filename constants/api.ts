const useLocalBackend: boolean = false;

const localhost: string = 'http://192.168.0.6:3001';
const staging: string = 'http://http://elecciones.kernelinformatica.com.ar:3001';
const production: string = 'http://http://elecciones.kernelinformatica.com.ar:3001';

export const WS_URL = !__DEV__ ? production :
    useLocalBackend ? localhost : staging;