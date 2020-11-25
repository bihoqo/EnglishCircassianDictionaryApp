import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const WordSection = (props) => {
    const wordObj = props.selectedWordObj;

    const renderDefinitions = ({ item, index }) => {
        const examples = item['examples'].map((example, index) => {
            const sentence = highlightTextBetweenQuotes(example['sentence']);
            const translation = highlightTextBetweenQuotes(example['translation']);
            return (
                <ListItem.Content key={index} style={styles.definitionContainer}>
                    <ListItem.Title style={styles.exampleText}>{sentence}</ListItem.Title>
                    <ListItem.Title style={styles.exampleText}>{translation}</ListItem.Title>
                </ListItem.Content>
            );
        });

        return (
            <ListItem>
                <ListItem.Content>
                    <ListItem.Title style={styles.meaningText}>
                        {(index + 1) + '. ' + item['meaning']}
                    </ListItem.Title>
                    {examples}
                </ListItem.Content>
            </ListItem>
        );
    }

    const header = (
        <View>
            <Text style={styles.header}>
                <Text style={styles.word}>{wordObj['word']}</Text>
                <Text>  [{wordObj['ipa']}]</Text>
                <Text> ({wordObj['type']})</Text>
            </Text>
            <View style={styles.hr}/>
        </View>
    );

    const footerFun = () => {
        const shapsugWord = wordObj['shapsug'] != null ? wordObj['shapsug'] : '-';
        const kabardianWord = wordObj['kabardian'] != null ? wordObj['kabardian'] : '-';
        const synonymsWords = wordObj['synonyms'] != null ? wordObj['synonyms'].join(', ') : '-';
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}><Text style={styles.highlight}>Synonyms</Text>: {synonymsWords}</Text>
                <Text style={styles.footerText}><Text style={styles.highlight}>Shapsug</Text>: {shapsugWord}</Text>
                <Text style={styles.footerText}><Text style={styles.highlight}>Kabardian</Text>: {kabardianWord}</Text>
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
    definitionContainer: {
        paddingTop: 20
    },
    header: {
        paddingTop: 10,
        paddingLeft: 10
    },
    word: {
        fontSize: 30,
        fontWeight: "bold"
    },
    highlight: {
        fontWeight: "bold",
    },
    footer: {
        paddingLeft: 10
    },
    footerText: {
        fontSize: 18,
        paddingBottom: 15
    },
    hr: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 20
    },
    meaningText: {
        fontSize: 20,
        color: '#585858'
    },
    exampleText: {
        fontSize: 16,
        color: 'black'
    }
});

const highlightTextBetweenQuotes = (text) => {
    const split = text.split("|");
    let result = [];
    if (split.length > 0) {
        split.forEach((part, index) => {
            if (index % 2 == 0) {
                result.push(<Text key={index}>{part}</Text>);
            } else {
                result.push(<Text key={index} style={styles.highlight}>{part}</Text>);
            }
        });
    } else {
        result = [<Text>{text}</Text>];
    }
    return result;
}

export default WordSection;
