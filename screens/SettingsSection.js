import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Paragraph, Colors, TouchableRipple, Button } from 'react-native-paper';

const SettingsSection = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <TouchableRipple onPress={() => props.changeCheckedShowLatin()}>
                    <View style={styles.row}>
                        <Paragraph style={styles.paragraphContainer}>Show latin transcription (alpha)</Paragraph>
                        <View pointerEvents="none">
                            <Checkbox status={props.checkedShowLatin ? 'checked' : 'unchecked'} />
                        </View>
                    </View>
                </TouchableRipple>
            </View>
            <View style={styles.goBackContainer}>
                <Button onPress={() => props.goBack(false)}>Go back</Button>
            </View>
        </View>
    );
}

export default SettingsSection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    paragraphContainer: {
        fontSize: 18,
        paddingTop: 5,
        paddingLeft: 10
    },
    goBackContainer: {
        padding: 15
    }
});

