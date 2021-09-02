import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const navigation = useNavigation();

    const submit = () => {
        navigation.navigate('Home')
    };

    return (
        <View style={styles.container}>

            <View style={styles.subContainer}>
                <Input placeholder='Ingrese su celular o código asignado' />

                <View style={styles.buttonContainer}>
                    <Button buttonStyle={styles.buttonStyle} title="Reportar presencia" type="outline" />
                </View>

                {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}

                <View style={styles.buttonContainer}>
                    <Button buttonStyle={styles.buttonStyle} title="Ingresar" onPress={submit} />
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
    },

    /** Botones */
    subContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: '10%',
        // backgroundColor: 'purple',
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
