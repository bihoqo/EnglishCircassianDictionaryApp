import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const WordSection = (props) => {
    const wordObj = props.selectedWordObj;

    const highlightTextBetweenQuotes = (text) => {
        const split = text.split("'''");
        let result = [];
        if (split.length > 0) {
            split.forEach((part, index) => {
                if (index % 2 == 0) {
                    result.push(<Text>{part}</Text>);
                } else {
                    result.push(<Text style={styles.highlight}>{part}</Text>);
                }
            });
        } else {
            result = [<Text>{text}</Text>];
        }
        return result;
    }

    const renderDefinitions = ({ item, index }) => {
        const examples = item['examples'].map((example, index) => {
            const sentence = highlightTextBetweenQuotes(example['sentence']);
            const translation = highlightTextBetweenQuotes(example['translation']);
            return (
                <ListItem.Content key={index} style={styles.container}>
                    <ListItem.Title>{sentence}</ListItem.Title>
                    <ListItem.Title>{translation}</ListItem.Title>
                </ListItem.Content>
            );
        });

        return (
            <ListItem>
                <ListItem.Content>
                    <ListItem.Title>
                        {(index + 1) + '. ' + item['meaning']}
                    </ListItem.Title>
                    {examples}
                </ListItem.Content>
            </ListItem>
        );
    }

    const header = (
        <View>
            <Text style={styles.header}>{wordObj['word']}</Text>
        </View>
    );

    const footerFun = () => {
        const shapsugWord = wordObj['shapsug'] != null ? wordObj['shapsug'] : '-';
        const kabardianWord = wordObj['kabardian'] != null ? wordObj['kabardian'] : '-';
        return (
            <View>
                <Text>Shapsug: {shapsugWord}</Text>
                <Text>Kabardian: {kabardianWord}</Text>
            </View>
        );
    };

    return (
        <FlatList
            ListHeaderComponent={header}
            ListFooterComponent={footerFun()}
            data={wordObj['definitions']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderDefinitions} />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    header: {
        padding: 10,
        fontSize: 30,
        fontWeight: "bold",
        textDecorationLine: 'underline'
    },
    highlight: {
        fontWeight: "bold",
    }
});

export default WordSection;
