import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Input as NativeBaseInput } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { FontAwesome5 } from '@expo/vector-icons';

import * as authService from '../services/auth.service'
import { createTwoButtonAlert } from '../utils/AlertsScreens';
import { PuntoMuestral, PuntoMuestralRaw } from '../models/punto-muestral.model';
import tiposPuntosMuestrales from '../constants/tipos-puntos-muestrales';

export default function Login() {
    const navigation = useNavigation();
    const [celular, setCelular] = React.useState('');

    const onClickReportarPresencia = async () => {
        if (!celular) return createTwoButtonAlert('Error', 'No se ingresó un código o celular válido');

        let resp: PuntoMuestralRaw[] | undefined;
        try {
            resp = await authService.getPuntoMuestralByCelular(celular);
        } catch (error) {
            console.log(error);
        }

        if (resp === undefined) return createTwoButtonAlert('Error', 'El nro de celular ingresado es incorrecto');
        if (!resp || resp.length < 1) return createTwoButtonAlert('Error', 'El nro de celular ingresado es incorrecto');

        const puntoMuestral: PuntoMuestral = new PuntoMuestral(resp[0]);
        const currentRegistroIngreso = puntoMuestral.registroIngreso;

        if (currentRegistroIngreso) return createTwoButtonAlert('Error', 'Usted ya reporto su presencia');

        let resp2: any | undefined;
        try {
            resp2 = await authService.setRegistroIngreso(celular, true);
        } catch (error) {
            console.log(error);
        }
        createTwoButtonAlert(resp2.status, resp2.body);

    };

    const onClickIngresar = async () => {
        if (!celular) return createTwoButtonAlert('Error', 'No se ingresó un código o celular válido');

        let resp: PuntoMuestralRaw[] | undefined;
        try {
            resp = await authService.getPuntoMuestralByCelular(celular);
        } catch (error) {
            console.log(error);
        }

        if (resp === undefined) return createTwoButtonAlert('Error', 'El nro de celular ingresado es incorrecto');
        if (!resp || resp.length < 1) return createTwoButtonAlert('Error', 'El nro de celular ingresado es incorrecto');

        const puntoMuestral: PuntoMuestral = new PuntoMuestral(resp[0]);

        if (puntoMuestral.idTipo === tiposPuntosMuestrales.TD && !puntoMuestral.registroIngreso) {
            createTwoButtonAlert('Error', 'Antes de ingresar debe reportar su presencia');
        } else {
            const routeHome: string = `/home/${puntoMuestral.id}`;
            const routeReportes: string = `/reportes/${puntoMuestral.id}`;
            navigation.navigate(puntoMuestral.idTipo === tiposPuntosMuestrales.TD ? routeHome : routeReportes);
        }

    };

    return (
        <View style={styles.container}>

            {/* Cumple la función de ocupar espacio para que el view siguiente quede centrado */}
            <View />

            <View style={styles.subContainer}>

                <Input
                    label='Ingrese su celular o código asignado'
                    keyboardType='number-pad'
                    style={styles.inputStyle}
                    labelStyle={styles.inputLabelStyle}
                    value={celular}
                    onChangeText={value => setCelular(value)}
                    leftIcon={<FontAwesome5 name="mobile-alt" size={24} color="#888" />}
                />

                <View style={styles.buttonContainer}>
                    <Button buttonStyle={styles.buttonStyle} title="Reportar presencia" type="outline" onPress={onClickReportarPresencia} disabled={!celular} />
                </View>

                <View style={styles.buttonContainer}>
                    <Button buttonStyle={styles.buttonStyle} title="Ingresar" onPress={onClickIngresar} disabled={!celular} />
                </View>

            </View>

            <View style={styles.subContainer}>
                <View style={styles.buttonContainer}>
                    <Button buttonStyle={styles.buttonStyle} title="Tutorial" type="outline" />
                </View>
            </View>

            {/* <EditScreenInfo path="/screens/Login.tsx" /> */}

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        // backgroundColor: 'gold',
    },

    inputStyle: {
        fontSize: 35,
        textAlign: 'center',
        // backgroundColor: 'red',
    },
    inputLabelStyle: {
        fontWeight: '100',
    },

    /** Botones */
    subContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        // marginHorizontal: '10%',
        // backgroundColor: 'purple',
    },
    buttonContainer: {
        marginBottom: 20,
        minWidth: '70%',
        // backgroundColor: 'purple',
    },
    buttonStyle: {
        borderRadius: 50,
        // backgroundColor: 'red',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
