import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet, ScrollView } from 'react-native';

import { Text, View } from '../components/Themed';

import { Avatar } from 'react-native-elements';

import { Select, CheckIcon } from 'native-base';
import { LinearProgress } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Mesa } from '../models/mesa.model';
import { Categoria } from '../models/categoria.model';
import { Resultado } from '../models/resultado.model';
import * as authService from '../services/auth.service';

export default function Reports() {
    const route = useRoute();
    const navigation = useNavigation();
    const params: any = route.params;
    const puntoMuestralId: string = params.puntoMuestralId;
    const [language, setLanguage] = React.useState("");

    const [showFiltros, setShowFiltros] = React.useState<boolean>(false);

    /** Listas de Datos */
    const [mesas, setMesas] = React.useState<Mesa[]>([]);
    const [categorias, setCategorias] = React.useState<Categoria[]>([]);

    /** Datos Seleccionados */
    const [mesa, setMesa] = React.useState<Mesa>();
    const [categoria, setCategoria] = React.useState<Categoria>();

    /** Resultados */
    const [resultados, setResultados] = React.useState<Resultado[]>([]);
    const [puntosInformadosMsg, setPuntosInformadosMsg] = React.useState<string>('');
    const [porcentajeMax, setPorcentajeMax] = React.useState<number>(50);

    // console.log('params', params, puntoMuestralId);

    React.useEffect(() => {
        getAllCategorias();
        getAllMesas();
    }, []);

    React.useEffect(() => {
        console.log('resultados', resultados);
        if (resultados.length < 1) return;
        const maxValue: number = Math.max(...resultados.map(e => e.porcentaje));
        console.log('maxValue', maxValue);
        setPorcentajeMax(maxValue)
    }, [resultados]);

    const getAllCategorias = async () => {
        let resp;
        try {
            resp = await authService.getAllCategorias();
        } catch (error) {
            console.log(error);
            return
        }
        if (!resp) return;
        setCategorias(resp);

        // Categoria por defecto gobernador
        if (resp.length > 0) setCategoria(resp[0]);
        refrescarLista();
    }

    const getAllMesas = async () => {
        let resp;
        try {
            resp = await authService.getAllMesas();
        } catch (error) {
            console.log(error);
            return
        }
        if (!resp) return;
        setMesas(resp);
    }

    const refrescarLista = async () => {
        let resp: string | undefined;
        try {
            resp = await authService.getPuntosInformados(categoria ? categoria.id : 0)
        } catch (error) {
            console.log(error);
            return
        }
        if (!resp) return;
        setPuntosInformadosMsg(resp);

        let resp2;
        try {
            resp2 = await authService.getResultados(categoria ? categoria.id : 0, mesa ? mesa.id : 0);
        } catch (error) {
            console.log(error);
            return
        }
        if (!resp2) return;
        // console.log('setResultados', resp2);
        const resultadosOrdenados: Resultado[] = resp2.sort((a, b) => a.porcentaje > b.porcentaje ? -1 : 1);
        setResultados([...resultadosOrdenados, ...resultadosOrdenados, ...resultadosOrdenados]);
    };

    return (
        <View style={styles.container}>

            <View style={styles.mainBlock}>

                <View style={styles.selectContainer}>
                    <Select
                        selectedValue={language}
                        minWidth={200}
                        placeholder="Seleccione una categoría"
                        onValueChange={(itemValue) => setLanguage(itemValue)}
                        _selectedItem={{ bg: "cyan.600", endIcon: <CheckIcon size={4} />, }}
                    >
                        {/* {categoria !== '' ? <Select.Item label={'Todos'} value={''} /> : null} */}
                        {categorias.map((elem: Categoria, index: number) =>
                            <Select.Item key={index} label={elem.descripcion} value={`${elem.id}`} />
                        )}
                    </Select>
                </View>


                <View style={styles.selectContainer}>
                    <Select
                        selectedValue={language}
                        minWidth={200}
                        placeholder="Filtrar por mesa"
                        onValueChange={(itemValue) => setLanguage(itemValue)}
                        _selectedItem={{ bg: "cyan.600", endIcon: <CheckIcon size={4} />, }}
                    >
                        <Select.Item label="JavaScript" value="js" />
                        <Select.Item label="TypeScript" value="ts" />
                        <Select.Item label="C" value="c" />
                        <Select.Item label="Python" value="py" />
                        <Select.Item label="Java" value="java" />
                    </Select>
                </View>

                <ScrollView style={{ flex: 1 }}>
                    {resultados.map((elem: Resultado, index: number) =>
                        <View style={styles.listaContainer} key={index}>
                            <View style={styles.avatarContainer}>

                                <Avatar
                                    rounded
                                    size="medium"
                                    title={elem.candidatoNombre}
                                    source={{ uri: elem.urlImagen, }}
                                />

                                <View style={styles.avatarCenter}>
                                    <Text style={styles.avatarText1}>{elem.candidatoNombre}</Text>
                                    <Text style={styles.avatarText2}>{elem.proyectados}</Text>
                                </View>

                                <View style={styles.avatarRight}>
                                    <Text style={styles.avatarText3}>{elem.porcentaje}%</Text>
                                </View>

                            </View>

                            <View style={{ width: '100%', marginVertical: 5 }}>
                                <LinearProgress color="primary" value={elem.porcentaje / porcentajeMax} variant='determinate' trackColor='#ddd' />
                            </View>
                        </View>
                    )}
                </ScrollView>

            </View>

            <View style={styles.mainBlock}>
                <Text style={styles.footerInfo}>puntosInformadosMsg: {puntosInformadosMsg}</Text>
                {/* <Text style={styles.footerInfo}>Muestras informadas: {93} / {146}</Text> */}
            </View>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingTop: '5%',
    },
    mainBlock: {
        width: '100%',
        // backgroundColor: 'green',
    },

    selectContainer: {
        marginBottom: 10,
    },

    listaContainer: {
        marginBottom: 20,
    },

    /** Avatar */
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    avatar: {
        // backgroundColor: 'green',
    },
    avatarCenter: {
        paddingLeft: 10,
        // backgroundColor: 'purple',
        flex: 1,
    },
    avatarText1: {
        fontSize: 18,
        // backgroundColor: 'lime',
    },
    avatarText2: {
        fontSize: 15,
        color: '#888',
        // backgroundColor: 'gold',
    },

    avatarRight: {
        minWidth: 80,
        // flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        // backgroundColor: 'blue',
        justifyContent: 'space-between',
    },
    avatarText3: {
        fontSize: 20,
        fontWeight: 'bold',
        // backgroundColor: 'gold',
        textAlign: 'right',
    },

    /** Footer info */
    footerInfo: {
        fontSize: 15,
        // fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#888'
    },
});
