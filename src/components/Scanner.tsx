import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { TouchableOpacity, View, Text, Button } from "react-native";

type ScannerProps = {
    onScan: (data: string) => void;
};

export function Scanner({ onScan }: FieldValues) {

    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [cod, setCod] = useState('')

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View >
                <Text style={{ textAlign: 'center' }}>Sem Permissão</Text>
                <Button onPress={requestPermission} title="Conceder Permissão" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
        setScanned(true);
        setIsCameraVisible(false);
        onScan(data)
        setCod(data)
        setTimeout(() => setScanned(false), 500);
    };

    return (
        <>
            {
                isCameraVisible ?
                    <View>
                        <CameraView onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} className="h-[100px] mt-2 ">
                            <View >

                            </View>
                        </CameraView>
                    </View>

                    :

                    <View className="flex flex-row items-center mt-5">
                        <View className="flex items-center flex-row">
                            <TouchableOpacity onPress={() => setIsCameraVisible(true)} className="bg-[#F43F5E] p-4 rounded-md w-full">
                                <Text className="font-semibold text-white text-center w-full">+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


            }
        </>
    )
}