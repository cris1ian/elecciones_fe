import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet, ScrollView, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import { Select, CheckIcon } from 'native-base';

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Avatar } from 'react-native-elements';
import { LinearProgress } from 'react-native-elements';

import * as authService from '../services/auth.service';
import { Mesa } from '../models/mesa.model';
import { Categoria } from '../models/categoria.model';
import { Candidato } from '../models/candidato.model';
import { MesaCandidato } from '../models/mesa-candidato.model';

import { validarDatos } from '../utils/ValidarDatos';

export default function Home() {
    const route = useRoute();
    const navigation = useNavigation();
    const params: any = route.params;
    const [spinner, setSpinner] = React.useState<boolean>(false);

    const [puntoMuestralId, setPuntoMuestralId] = React.useState<string>();

    /** Listas de Datos */
    const [mesas, setMesas] = React.useState<Mesa[]>([]);
    const [categorias, setCategorias] = React.useState<Categoria[]>([]);
    const [mesasCandidatos, setMesasCandidatos] = React.useState<MesaCandidato[]>([]);

    const [mesa, setMesa] = React.useState<Mesa>();
    const [categoria, setCategoria] = React.useState<any>();
    const [fileCaptura, setFileCaptura] = React.useState<any>(null);

    React.useEffect(() => {
        console.log('params', params, puntoMuestralId);
        if (!params) return
        setPuntoMuestralId(params?.puntoMuestralId);
    }, [params]);

    React.useEffect(() => {
        console.log('puntoMuestralId', puntoMuestralId);
        if (!puntoMuestralId) return
        getMesasByPuntoMuestral();
    }, [puntoMuestralId]);

    React.useEffect(() => {
        console.log('mesa', mesa);
        if (!mesa) return
        onChangeMesa(mesa)
    }, [mesa]);

    React.useEffect(() => {
        console.log('categoria', categoria);
        onChangeCategoria(categoria)
    }, [categoria]);

    React.useEffect(() => { console.log('categorias', categorias); }, [categorias]);
    React.useEffect(() => { console.log('mesas', mesas); }, [mesas]);

    const clearAll = (excepMesa = false) => {
        setMesasCandidatos([]);
        setCategorias([]);
        setCategoria(undefined);
        setFileCaptura(undefined);
        if (!excepMesa) setMesa(undefined);
    }

    const getMesasByPuntoMuestral = async () => {
        if (puntoMuestralId === undefined) return console.log('puntoMuestralId === undefined', puntoMuestralId, puntoMuestralId === undefined);
        let resp: Mesa[] | undefined;
        try {
            resp = await authService.getMesasByPuntoMuestral(+puntoMuestralId);
        } catch (error) {
            console.log(error);
            return
        }
        if (!resp) return console.log('!resp', resp, !resp);
        setMesas(resp);
    }

    const onChangeMesa = async (m: Mesa) => {
        if (puntoMuestralId === undefined) return console.log('puntoMuestralId === undefined', puntoMuestralId, puntoMuestralId === undefined);
        clearAll(true);
        let resp: Categoria[] | undefined;
        try {
            resp = await authService.getCategoriasByMesaAndPuntoMuestral(+puntoMuestralId, m);
        } catch (error) {
            console.log(error);
            return
        }
        if (!resp) return console.log('!resp', resp, !resp);
        console.log('setCategorias', resp);
        setCategorias(resp);
    }

    /**
     * Cargo los candidatos de la categoria seleccionada
     * Me creo las nuevas mesasCandidatos que voy a mandar
     */
    const onChangeCategoria = async (c: Categoria) => {
        console.log('onChangeCategoria', c);
        if (mesa === undefined) return console.log('mesa === undefined', mesa, mesa === undefined);
        if (!c) {
            console.log('categoria not defined', 'setMesasCandidatos to []');
            return setMesasCandidatos([]);
        }

        let resp: Candidato[] | undefined;
        try {
            console.log('about to fire that api 1', c);
            resp = await authService.getCandidatosByCategoria(c.id);
            console.log('about to fire that api 2', c, categoria);
        } catch (error) {
            console.log(error);
            return
        }
        if (!resp) return console.log('!resp', resp, !resp);
        const _sortedCandidatos: Candidato[] = resp.sort((a: Candidato, b: Candidato) => a.candidatoTipo - b.candidatoTipo);
        const _mesasCandidatos: MesaCandidato[] = _sortedCandidatos.map((c: Candidato) => new MesaCandidato({ mesa: mesa, candidato: c }));
        console.log('setMesasCandidatos', resp, _sortedCandidatos, _mesasCandidatos);
        setMesasCandidatos(_mesasCandidatos);
    }

    /** Estaba desabilitado el botón en la APP v1 Ionic*/
    const onClickFoto = async () => {
        // this.cameraService.takePictureAndReturnFile()
        //     .then(
        //         (f) => this.fileCaptura = f
        //     )
    }

    const onClickConfirmar = async () => {
        // Valido datos
        const datosValidos: boolean = validarDatos(mesasCandidatos);
        if (!datosValidos) return console.log('Datos no válidos', datosValidos);

        if (mesa === undefined) return console.log('mesa === undefined', mesa, mesa === undefined);

        let resp: any | undefined;
        try {
            setSpinner(true);
            resp = await authService.postMesasCandidatos(mesasCandidatos, fileCaptura, mesa, categoria)
        } catch (error) {
            console.log(error);
            setSpinner(false);
            return
        }
        setSpinner(false);
        if (!resp) return console.log('!resp', resp, !resp);
        clearAll();

    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.mainBlock}>
                    <Text style={styles.title}>Seleccione mesa y categoria</Text>

                    {/* {categorias.map((elem: Categoria, index: number) =>

                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{elem.descripcion}</Text>
                    )}

                    <Text style={styles.title}>Categoría: {categoria ? `${categoria?.id}` : undefined} / {categoria?.id} / {`${categoria !== undefined}`} / {`${!!categoria}`} / {`${categoria ? categoria.id : undefined}`}</Text> */}

                    {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}

                    <View style={styles.selectContainer}>
                        <Select
                            selectedValue={mesa ? `${mesa?.id}` : ''}
                            minWidth={200}
                            placeholder="Seleccione una mesa"
                            onValueChange={(itemValue: string) => setMesa(mesas.find((e: Mesa) => `${e.id}` === itemValue))}
                            _selectedItem={{ bg: "cyan.600", endIcon: <CheckIcon size={4} />, }}
                        >
                            {/* {mesas !== '' ? <Select.Item label={'Todos'} value={''} /> : null} */}
                            {mesas.map((elem: Mesa, index: number) =>
                                <Select.Item key={index} label={elem.descripcion} value={`${elem.id}`} />
                            )}
                        </Select>
                    </View>

                    <View style={styles.selectContainer}>
                        <Select
                            minWidth={200}
                            placeholder="Seleccione una categoría"
                            selectedValue={categoria ? `${categoria?.id}` : ''}
                            defaultValue={undefined}
                            onValueChange={(itemValue: string) => { console.log('onValueCHange select', itemValue); setCategoria(categorias.find((e: Categoria) => `${e.id}` === itemValue)) }}
                            _selectedItem={{ bg: "cyan.600", endIcon: <CheckIcon size={4} />, }}
                        >
                            {/* {categorias !== '' ? <Select.Item label={'Todos'} value={''} /> : null} */}
                            {categorias.map((elem: Categoria, index: number) =>
                                <Select.Item key={index} label={elem.descripcion} value={`${elem.id}`} />
                            )}
                        </Select>
                    </View>

                    {/* Por una cuestion de timing en las request se dispara primero onChangeCategoria con una categoria precargada
                    y luego con categoria undefined. El segundo se completa más rapido por no tener una request en el medio y el primero 
                    se completa después anulando el clear que hizo la segunda llamada. Con este fix casero lo arreglo desde lo visual */}
                    {categoria &&
                        <>
                            <Text style={styles.title}>Ingrese cantidad de votos</Text>

                            {mesasCandidatos.map((elem: MesaCandidato, index: number) => {
                                const setCantidadVotos = (value: string) => {
                                    const _editedMesaCandidato: MesaCandidato = { ...elem, cantidadVotos: +value };
                                    let _editedMesasCandidatos: MesaCandidato[] = mesasCandidatos.map((e: MesaCandidato) => e.candidato.id === elem.candidato.id ? _editedMesaCandidato : e);
                                    if (index + 1 === mesasCandidatos.length - 1) _editedMesasCandidatos[mesasCandidatos.length - 1].cantidadVotos = +value; /** Copio el anteúltimo en el último */
                                    setMesasCandidatos(_editedMesasCandidatos);
                                };

                                return (
                                    <View style={[styles.listaContainer, { backgroundColor: elem.candidato.color }]} key={index}>
                                        <View style={styles.avatarContainer}>

                                            <Avatar
                                                rounded
                                                size="medium"
                                                title={elem.candidato.nombre.substr(0, elem.candidato.nombre.indexOf('-'))}
                                                titleStyle={{ color: 'black', fontSize: 20, fontWeight: 'bold', }}
                                                source={{ uri: elem.candidato.urlimagen }}
                                            />

                                            <View style={styles.avatarCenter}>
                                                <Text style={styles.avatarText1}>{elem.candidato.nombre}</Text>
                                            </View>

                                            <View style={styles.avatarRight}>
                                                <TextInput
                                                    placeholder="0"
                                                    style={styles.inputStyle}
                                                    value={elem.cantidadVotos ? `${elem.cantidadVotos}` : undefined}
                                                    onChangeText={value => setCantidadVotos(value)}
                                                    keyboardType="numeric"
                                                />
                                            </View>

                                        </View>

                                        {/* <View style={{ width: '100%', marginVertical: 5 }}>
                                <LinearProgress color="primary" value={elem.porcentaje / porcentajeMax} variant='determinate' trackColor='#ddd' />
                            </View> */}
                                    </View>
                                )
                            })}
                        </>
                    }

                    <Text style={styles.title}>Saque una foto de la planilla {'\n'} (opcional)</Text>

                    <View style={styles.subContainer}>
                        <Button buttonStyle={styles.cameraButton} disabled={true} icon={<Icon name="camera" size={35} color="white" />} onPress={onClickFoto} />
                    </View>

                </View>

                <View style={styles.mainBlock}>
                    <View style={styles.subContainer}>
                        <View style={styles.buttonContainer}>
                            <Button buttonStyle={styles.buttonStyle} title="Confirmar" disabled={spinner || !categoria} loading={spinner} onPress={onClickConfirmar} />
                        </View>
                    </View>
                </View>

                {/* Use a light status bar on iOS to account for the black space above the modal */}
                <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingTop: '5%',
        minHeight: '80%'
    },
    mainBlock: {
        width: '100%',
        // backgroundColor: 'green',
    },

    selectContainer: {
        marginBottom: 10,
    },

    /** Camera Button */
    cameraButton: {
        width: 70,
        height: 70,
        borderRadius: 70,
        // backgroundColor: 'red',
    },

    /** Botones */
    subContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: '10%',
        marginBottom: 20,
        // backgroundColor: 'gold',
    },
    buttonContainer: {
        marginBottom: 20,
        width: '100%',
        // backgroundColor: 'purple',
    },
    buttonStyle: {
        borderRadius: 50,
        // backgroundColor: 'red',
    },

    /** Titulos de secciones */
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },


    /** Avatar */
    listaContainer: {
        marginBottom: 20,
        borderRadius: 90,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    avatar: {
        // backgroundColor: 'green',
    },
    avatarCenter: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: 'transparent',
        // backgroundColor: 'purple',
    },
    avatarText1: {
        fontSize: 15,
        // backgroundColor: 'lime',
    },

    avatarRight: {
        width: 100,
        paddingRight: 20,
        justifyContent: 'center',
        // backgroundColor: 'green',
        backgroundColor: 'transparent',
    },
    inputStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        textAlignVertical: 'center',
        // backgroundColor: 'gold',
    },

});
