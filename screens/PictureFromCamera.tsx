import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button } from 'react-native-elements';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImageManipulator from 'expo-image-manipulator';

import { Text, View } from '../components/Themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PictureCamera } from '../models/picture-camera.interface';

export default function PictureFromCamera() {
    let camera: Camera | null;
    const imageQuality: number = 1 / 4;
    const route = useRoute();
    const navigation = useNavigation();
    const [spinner, setSpinner] = React.useState<boolean>(false);
    const [type, setType] = React.useState(Camera.Constants.Type.back);
    const params: any = route.params;

    const __takePicture = async () => {
        console.log('Taking picture...');
        if (!camera) return console.log('!camera');
        setSpinner(true);
        const photo = await camera.takePictureAsync({ quality: imageQuality });
        const compressedPhoto = await compress(photo);
        console.log('Photo taken!', photo, compressedPhoto);
        navigation.navigate('Home', { photo: compressedPhoto, puntoMuestralId: params?.puntoMuestralId });
        setSpinner(false);
    }

    const compress = async (_image: PictureCamera): Promise<PictureCamera> => {
        const manipResult = await ImageManipulator.manipulateAsync(
            _image.uri,
            [],
            { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log('Compressed picture', manipResult);
        return manipResult
    };

    const renderCamera = () => {
        return (
            <View style={styles.container}>
                <Camera style={styles.camera} type={type} ratio={'16:9'} ref={(r) => { camera = r }}>
                    <View style={styles.buttonContainer}>

                        <Button buttonStyle={styles.cameraButton} disabled={spinner} icon={<Icon name="camera" size={35} color="white" />} onPress={__takePicture} />

                    </View>
                </Camera>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, }}>

            {renderCamera()}

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: 20,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },

    /** Camera Button */
    cameraButton: {
        width: 70,
        height: 70,
        borderRadius: 70,
        // backgroundColor: 'red',
    },
});
