import { ListItem } from 'react-native-elements';
import React from 'react';
import { FlatList, ScrollView } from 'react-native';

const AutocompleteSection = (props) => {

    const renderWords = ({item}) => {
        return (
            <ListItem onPress={() => props.selectNewWord(item)}>
                <ListItem.Content>
                    <ListItem.Title>
                        {item}
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        );
    }

    return (
        <FlatList data={props.data} keyExtractor={(item, index) => index.toString()} renderItem={renderWords} />
    );
}

export default AutocompleteSection;
