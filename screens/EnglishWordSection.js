import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const EnglishWordSection = (props) => {
    const wordObj = props.selectedWordObj;

    const renderWords = ({ item, index }) => {
        return (
            <ListItem onPress={() => props.selectNewWord(item)}>
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
            <Text style={styles.typeHeader}>
                {title}:
            </Text>
        </View>
    )

    const header = (
        <View>
            <Text style={styles.header}>
                <Text style={styles.word}>{wordObj['searchWord']}</Text>
            </Text>
            <View style={styles.hr}/>
            {wordObj['meaning']['lemma'].length > 0 ? createHeader('Lemmas') : null}
        </View>
    );

    const listOfLemmmas = () => {
        return <FlatList
            ListHeaderComponent={header}
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
    typeHeader: {
        paddingTop: 20,
        paddingLeft: 10,
        fontSize: 25,
        textDecorationLine: 'underline'
    },
    word: {
        fontSize: 30,
        fontWeight: "bold"
    },
    hr: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 20
    }
});

export default EnglishWordSection;
