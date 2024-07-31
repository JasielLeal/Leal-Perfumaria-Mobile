import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function LongPressMenu({ onOptionSelect }) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleLongPress = () => {
        setModalVisible(true);
    };

    const handleOptionSelect = (option) => {
        setModalVisible(false);
        onOptionSelect(option);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onLongPress={handleLongPress}
            >
                <Text style={styles.buttonText}>Press and Hold</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect('Option 1')}>
                                <Icon name="edit" size={20} color="#000" />
                                <Text style={styles.optionText}>Option 1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect('Option 2')}>
                                <Icon name="delete" size={20} color="#000" />
                                <Text style={styles.optionText}>Option 2</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        backgroundColor: '#F43F5E',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        elevation: 10,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
    },
});
