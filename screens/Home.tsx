import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Select, CheckIcon } from 'native-base';

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Home() {
    const [language, setLanguage] = React.useState("")

    return (
        <View style={styles.container}>

            <View style={styles.mainBlock}>
                <Text style={styles.title}>Seleccione mesa y categoria</Text>

                {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}

                <View style={styles.selectContainer}>
                    <Select
                        selectedValue={language}
                        minWidth={200}
                        placeholder="Seleccione una mesa"
                        onValueChange={(itemValue) => setLanguage(itemValue)}
                        _selectedItem={{
                            bg: "cyan.600",
                            endIcon: <CheckIcon size={4} />,
                        }}
                    >
                        <Select.Item label="JavaScript" value="js" />
                        <Select.Item label="TypeScript" value="ts" />
                        <Select.Item label="C" value="c" />
                        <Select.Item label="Python" value="py" />
                        <Select.Item label="Java" value="java" />
                    </Select>
                </View>

                <View style={styles.selectContainer}>
                    <Select
                        selectedValue={language}
                        minWidth={200}
                        placeholder="Seleccione una categoría"
                        onValueChange={(itemValue) => setLanguage(itemValue)}
                        _selectedItem={{
                            bg: "cyan.600",
                            endIcon: <CheckIcon size={4} />,
                        }}
                    >
                        <Select.Item label="JavaScript" value="js" />
                        <Select.Item label="TypeScript" value="ts" />
                        <Select.Item label="C" value="c" />
                        <Select.Item label="Python" value="py" />
                        <Select.Item label="Java" value="java" />
                    </Select>
                </View>

                <Text style={styles.title}>Saque una foto de la planilla {'\n'} (opcional)</Text>

                <View style={styles.subContainer}>
                    <Button buttonStyle={styles.cameraButton}
                        icon={<Icon name="camera" size={35} color="white" />}
                    />
                </View>
            </View>

            <View style={styles.mainBlock}>
                <View style={styles.subContainer}>
                    <View style={styles.buttonContainer}>
                        <Button buttonStyle={styles.buttonStyle} title="Confirmar" />
                    </View>
                </View>
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
        paddingHorizontal: '15%',
    },
    mainBlock: {
        width: '100%',
        // backgroundColor: 'green',
    },

    selectContainer: {
        marginBottom: 30,
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

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 30,
        textAlign: 'center',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
