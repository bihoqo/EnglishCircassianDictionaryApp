import { ListItem } from 'react-native-elements';
import React from 'react';
import { FlatList, Keyboard } from 'react-native';

const AutocompleteSection = (props) => {

    const renderWords = ({item}) => {
        return (
            <ListItem onPress={() => wordOnPressHandler(item)}>
                <ListItem.Content>
                    <ListItem.Title>
                        {item}
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

export default AutocompleteSection;
