import { ListItem } from 'react-native-elements';
import React from 'react';
import { FlatList, Keyboard, Text, StyleSheet } from 'react-native';
import { convertToLatin, isWordInEnglish } from './GlobalFunctions.js';

const AutocompleteSection = (props) => {

    const renderWords = ({ item }) => {
        let latinTextSeciton = null;
        if (!isWordInEnglish(item)) {
            latinTextSeciton = (
                <Text style={styles.latinText}>  {props.checkedShowLatin ? convertToLatin(item) : null}</Text>
            )
        }
        return (
            <ListItem onPress={() => wordOnPressHandler(item)}>
                <ListItem.Content>
                    <ListItem.Title style={styles.suggestedWordStyle}>
                        {item}
                        {latinTextSeciton}
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        );
    }

    const wordOnPressHandler = (item) => {
        props.selectNewWord(item);
        Keyboard.dismiss();
    }

    return (
        <FlatList keyboardShouldPersistTaps='handled'
            data={props.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWords} />
    );
}


const styles = StyleSheet.create({
    latinText: {
        color: '#33CC33'
    },
    suggestedWordStyle: {
        fontSize: 18
    }
});

export default AutocompleteSection;
