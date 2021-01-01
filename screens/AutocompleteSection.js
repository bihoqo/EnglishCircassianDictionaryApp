import { ListItem } from 'react-native-elements';
import React from 'react';
import { FlatList, Keyboard, Text, StyleSheet } from 'react-native';
import { convertToLatin, isWordInEnglish } from './GlobalFunctions.js';

const AutocompleteSection = (props) => {

    const renderWords = ({ item }) => {
        const wordItem = item['word'];
        const langItem = item['lang'];
        let latinTextSection = null;
        let langTextSection = null;
        if (!isWordInEnglish(wordItem)) {
            latinTextSection = (
                <Text style={styles.latinText}>  {props.checkedShowLatin ? convertToLatin(wordItem) : null}</Text>
            )
            langTextSection = (
                <Text style={styles.lang}>  {"[" + langItem + "]"}</Text>
            )
        }
        return (
            <ListItem onPress={() => wordOnPressHandler(wordItem)}>
                <ListItem.Content>
                    <ListItem.Title style={styles.suggestedWordStyle}>
                        {wordItem}
                        {latinTextSection}
                        {langTextSection}
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
    },
    lang: {
        color: 'crimson',
        fontSize: 14
    }
});

export default AutocompleteSection;
