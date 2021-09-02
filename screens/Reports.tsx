import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

import { Avatar } from 'react-native-elements';

import { Select, CheckIcon } from 'native-base';
import { LinearProgress } from 'react-native-elements';

export default function Reports() {
    const [language, setLanguage] = React.useState("")

    return (
        <View style={styles.container}>

            <View style={styles.mainBlock}>

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


                <View style={styles.selectContainer}>
                    <Select
                        selectedValue={language}
                        minWidth={200}
                        placeholder="Filtrar por mesa"
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

                {/* <Text style={styles.title}>Seleccione mesa y categoria</Text> */}

                {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}

                {/* <Text style={styles.title}>Saque una foto de la planilla {'\n'} (opcional)</Text> */}
                <View>
                    <View style={styles.avatarContainer}>

                        <Avatar
                            rounded
                            size="medium"
                            title='Frente de TodOs'
                            source={{ uri: 'https://organicthemes.com/demo/profile/files/2018/05/profile-pic.jpg', }}
                        />

                        <View style={styles.avatarCenter}>
                            <Text style={styles.avatarText1}>{'131-Frente Federal Nos'}</Text>
                            <Text style={styles.avatarText2}>{'22712 votos'}</Text>
                        </View>

                        <View style={styles.avatarRight}>
                            <Text style={styles.avatarText3}>{'99.99%'}</Text>
                        </View>

                    </View>

                    <View style={{ width: '100%', marginVertical: 5 }}>
                        <LinearProgress color="primary" value={0.45} variant='determinate' trackColor='transparent' />
                    </View>
                </View>
            </View>

            <View style={styles.mainBlock}>
                <Text style={styles.footerInfo}>Muestras informadas: {93} / {146}</Text>
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
