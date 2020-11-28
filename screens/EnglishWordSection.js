import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const EnglishWordSection = (props) => {
    const wordObj = props.selectedWordObj;

    const renderWords = ({ item, index }) => {
        return (
            <ListItem onPress={() => props.selectNewWord(removeTextBetweenBrackets(item))}>
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
                    <Text style={styles.word}>{title}</Text>
                </Text>
                <View style={styles.hr} />
            </View>
    );

    const listOfLemmmas = () => {
        const header = wordObj['meaning']['lemmas'].length > 0 ? createHeader(wordObj['word']) : null;
        const footer = wordObj['meaning']['verbs'].length > 0 ? createHeader("to " + wordObj['word']) : null;
        return <FlatList
            ListHeaderComponent={header}
            ListFooterComponent={footer}
            data={wordObj['meaning']['lemmas']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWords} />
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={listOfLemmmas()}
                removeClippedSubviews={false}
                data={wordObj['meaning']['verbs']}
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

const removeTextBetweenBrackets = (text) => {
    const result = text.replace(/ *\([^)]*\) */g, "");
    if (result.includes("/")) {
        return result.split("/")[0].trim();
    } else {
        return result;
    }
}

export default EnglishWordSection;
