import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet, ScrollView } from 'react-native';

import { Text, View } from '../components/Themed';

import { Avatar } from 'react-native-elements';

import { Select, CheckIcon, Spinner, useToast } from 'native-base';
import { LinearProgress } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Mesa } from '../models/mesa.model';
import { Categoria } from '../models/categoria.model';
import { Resultado } from '../models/resultado.model';
import * as authService from '../services/auth.service';

import { SearchBar } from 'react-native-elements';
import { Button } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';

export default function Reports() {
    const [spinner, setSpinner] = React.useState<boolean>(false);
    const [enableSearchButton, setEnableSearchButton] = React.useState<boolean>(false);

    /** Listas de Datos */
    const [mesas, setMesas] = React.useState<Mesa[]>([]);
    const [categorias, setCategorias] = React.useState<Categoria[]>([]);

    /** Datos Seleccionados */
    const [mesasFilter, setMesasFilter] = React.useState<string>('');
    const [mesa, setMesa] = React.useState<Mesa>();
    const [categoria, setCategoria] = React.useState<Categoria>();

    /** Resultados */
    const [resultados, setResultados] = React.useState<Resultado[]>([]);
    const [puntosInformadosMsg, setPuntosInformadosMsg] = React.useState<string>('');
    const [porcentajeMax, setPorcentajeMax] = React.useState<number>(50);

    const timerRef = React.useRef<any>();
    const toast = useToast()

    // console.log('params', params, puntoMuestralId);

    React.useEffect(() => {
        getAllCategorias();
        getAllMesas();
    }, []);

    React.useEffect(() => {
        if (categorias.length === 0) return console.log('categorias.length === 0', categorias);
        refrescarLista(categoria ? categoria : categorias[0], mesa);
    }, [categoria]);

    // React.useEffect(() => {
    //     if (mesas.length === 0) return console.log('mesas.length === 0', mesasFilter);

    //     debounceCallback();
    // }, [mesasFilter]);

    /** Debounce function for searchbar */
    // const debounceCallback = () => {
    //     console.log('debounceCallback',);
    //     console.log('timerRef PRE', timerRef.current);

    //     if (timerRef.current) clearTimeout(timerRef.current);

    //     timerRef.current = setTimeout(() => {
    //         console.log('fired Debounce!');
    //         onClickBuscarPorMesa()
    //     }, 400);
    //     console.log('timerRef POST', timerRef.current);
    // }

    const onClickBuscarPorMesa = (borrarFiltroMesa?: boolean) => {
        console.log('onClickBuscarPorMesa');
        console.log('mesasFilter', mesasFilter,);
        const _mesa: Mesa | undefined = borrarFiltroMesa ? undefined : mesas.find(m => m.descripcion === mesasFilter);
        setMesa(_mesa);
        if (!_mesa && mesasFilter !== '' && !borrarFiltroMesa) return toast.show({ title: "Mesa no encontrada", variant: 'left-accent', placement: 'bottom' });
        if (!borrarFiltroMesa) setEnableSearchButton(false);
        // if (!_mesa && value !== '') return createTwoButtonAlert('Error', `Mesa no encontrada`);

        console.log('_mesa', _mesa);
        const categoriaDefault: Categoria = categoria ? categoria : categorias[0];
        refrescarLista(categoriaDefault, _mesa);
    }

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

        // Categoria por defecto: la primera que llegue
        if (resp.length > 0) setCategoria(resp[0]);
        const categoriaDefault: Categoria = resp[0];
        refrescarLista(categoriaDefault);
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

    const refrescarLista = async (_categoria: Categoria, _mesa?: Mesa) => {
        console.log('refrescarLista', _categoria, _mesa);
        let resp: string | undefined;
        try {
            setSpinner(true);
            resp = await authService.getPuntosInformados(_categoria ? _categoria.id : 0)
        } catch (error) {
            console.log(error);
            setSpinner(false);
            return
        }
        if (!resp) return setSpinner(false);
        console.log('setPuntosInformadosMsg', resp);
        setPuntosInformadosMsg(resp);

        let resp2;
        try {
            setSpinner(true);
            resp2 = await authService.getResultados(_categoria ? _categoria.id : 0, _mesa ? _mesa.id : 0);
        } catch (error) {
            console.log(error);
            setSpinner(false);
            return
        }
        setSpinner(false);
        if (!resp2) return;
        // console.log('setResultados', resp2);
        const resultadosOrdenados: Resultado[] = resp2.sort((a, b) => a.porcentaje > b.porcentaje ? -1 : 1);
        // setResultados(__DEV__ ? [...resultadosOrdenados, ...resultadosOrdenados, ...resultadosOrdenados] : resultadosOrdenados);
        setResultados(resultadosOrdenados);
    };

    return (
        <View style={{ flex: 1, }}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.selectContainer}>
                    <Select
                        minWidth={200}
                        placeholder="Seleccione una categoría"
                        selectedValue={categoria ? `${categoria?.id}` : ''}
                        onValueChange={(itemValue: string) => setCategoria(categorias.find((e: Categoria) => `${e.id}` === itemValue))}
                        _selectedItem={{ bg: "cyan.600", endIcon: <CheckIcon size={4} />, }}
                    >
                        {/* {categoria !== '' ? <Select.Item label={'Todos'} value={''} /> : null} */}
                        {categorias.map((elem: Categoria, index: number) =>
                            <Select.Item key={index} label={elem.descripcion} value={`${elem.id}`} />
                        )}
                    </Select>
                </View>

                <View style={styles.selectContainer}>
                    <SearchBar
                        placeholder="Filtrar por mesa"
                        onChangeText={(value) => { setEnableSearchButton(true); setMesasFilter(value); }}
                        onClear={() => { setEnableSearchButton(false); onClickBuscarPorMesa(true); }}
                        keyboardType='number-pad'
                        value={mesasFilter}
                        lightTheme
                        round
                        containerStyle={{ backgroundColor: 'transparent', borderBottomWidth: 0, borderTopWidth: 0, }}
                        inputContainerStyle={{ backgroundColor: '#ddd5', }}
                        showLoading={spinner}
                    />
                </View>

                <View style={styles.mesasFilterContainer}>
                    <Text style={styles.mesasFilter}>{mesasFilter !== '' ? `Mesa ${mesasFilter}` : 'Todas las mesas'}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Button buttonStyle={styles.mesasFilterButtonStyle}
                            title="Buscar"
                            disabled={spinner || !enableSearchButton}
                            onPress={() => onClickBuscarPorMesa()}
                            icon={<Icon name="search" size={15} color="white" style={{ marginRight: 10 }} />} />

                        <Button buttonStyle={styles.mesasRefreshButtonStyle}
                            disabled={spinner}
                            onPress={() => refrescarLista(categoria ? categoria : categorias[0], mesa)}
                            icon={<Icon name="refresh" size={15} color="white" />} />
                    </View>
                </View>

                <View style={{ minHeight: 10, }}>
                    {spinner ? <LinearProgress color={"primary"} /> : null}
                </View>


                {resultados.length === 0 ? <Text style={styles.title}>Esta mesa todavía no tiene información</Text> : null}

                {resultados.map((elem: Resultado, index: number) =>
                    <View style={styles.listaContainer} key={index}>
                        <View style={styles.avatarContainer}>

                            <Avatar
                                rounded
                                size="medium"
                                title={elem.candidatoNombre.substr(0, elem.candidatoNombre.indexOf('-'))}
                                titleStyle={{ color: 'black', fontSize: 20, fontWeight: 'bold', }}
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
                            {/* <LinearProgress color={"primary"} value={elem.porcentaje / (porcentajeMax || 100)} variant='determinate' trackColor='#ddd' /> */}
                            <LinearProgress color={"primary"} value={elem.porcentaje / 100} variant='determinate' trackColor='#ddd' />
                        </View>
                    </View>
                )}

                {/* Use a light status bar on iOS to account for the black space above the modal */}
                <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            </ScrollView>

            <View style={styles.footerContainer}>
                <Text style={styles.footerInfo}>{puntosInformadosMsg}</Text>
                {/* <Text style={styles.footerInfo}>Muestras informadas: {93} / {146}</Text> */}
            </View>

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingTop: '5%',
        // backgroundColor: 'green',
    },
    mainBlock: {
        width: '100%',
        // backgroundColor: 'green',
    },

    selectContainer: {
        marginBottom: 10,
        // backgroundColor: 'green',
    },

    /** Titulos de secciones */
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },

    /** Info del searchbar */
    mesasFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        // backgroundColor: 'green',
    },
    mesasFilterButtonStyle: {
        borderRadius: 50,
        minWidth: 110,
        // backgroundColor: 'red',
    },
    mesasRefreshButtonStyle: {
        borderRadius: 50,
        width: 40,
        height: 40,
        marginLeft: 10,
        // backgroundColor: 'red',
    },
    mesasFilter: {
        fontSize: 18,
        // fontWeight: 'bold',
        textAlign: 'center',
        color: '#888',
        // backgroundColor: 'red',
    },

    chipcontainerStyle: {
        margin: 5,
    },

    /** Avatar */
    listaContainer: {
        marginBottom: 20,
    },
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
        fontSize: 15,
        // backgroundColor: 'lime',
    },
    avatarText2: {
        fontSize: 15,
        color: '#888',
        // backgroundColor: 'gold',
    },

    avatarRight: {
        minWidth: 80,
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
    footerContainer: {
        marginVertical: 10,
    },
    footerInfo: {
        fontSize: 15,
        marginBottom: 20,
        textAlign: 'center',
        color: '#888'
    },
});
