import { Alert } from "react-native";

export const createTwoButtonAlert = (title: string, content: string, onOkCallback?: () => void) =>
    Alert.alert(
        title,
        content,
        [{ text: "OK", onPress: () => { console.log("OK Pressed"); if (onOkCallback) onOkCallback() } }],
        { cancelable: false }
    );

export const createThreeButtonAlert = (title: string, content: string) =>
    Alert.alert(
        title,
        content,
        [
            {
                text: "Ask me later",
                onPress: () => console.log("Ask me later pressed")
            },
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
    );

export const confirmDialog = (title: string, content: string, onOkCallback: () => void, confirmText: string = 'Confirmar', cancelText: string = 'Cancelar') => {
    Alert.alert(
        title,
        content,
        [
            { text: cancelText, onPress: () => console.log("Cancel Pressed"), style: "cancel" },
            { text: confirmText, onPress: () => onOkCallback(), },
        ],
    );
}
