import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const EnglishWordSection = (props) => {
    const wordObj = props.selectedWordObj;

    const renderWords = ({ item, index }) => {
        return (
            <ListItem>
                <ListItem.Content>
                    <ListItem.Title style={styles.meaningText}>
                        {(index + 1) + '. ' + item}
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        );
    }

    const createHeader = (title) => (
        <View>
            <Text style={styles.header}>
                {title}
            </Text>
            <View style={styles.hr} />
        </View>
    )

    const listOfLemmmas = () => {
        return <FlatList
            ListHeaderComponent={wordObj['meaning']['lemma'].length > 0 ? createHeader('Lemmas') : null}
            ListFooterComponent={wordObj['meaning']['verb'].length > 0 ? createHeader('Verbs') : null}
            data={wordObj['meaning']['lemma']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWords} />
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={listOfLemmmas()}
                data={wordObj['meaning']['verb']}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderWords} />
        </View>
    );
}

const styles = StyleSheet.create({
    meaningText: {
        fontSize: 20
    },
    header: {
        paddingTop: 10,
        paddingLeft: 10,
        fontSize: 30
    },
    hr: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 20
    }
});

export default EnglishWordSection;
