import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { convertToLatin } from './GlobalFunctions.js';

const CircassianWordSection = (props) => {
    const wordObj = props.selectedWordObj;

    const renderDefinitions = ({ item, index }) => {
        const examples = item['examples'].map((example, index) => {
            const sentence = highlightTextBetweenQuotes(example['sentence']);
            const latinSentence = highlightTextBetweenQuotes(convertToLatin(example['sentence']));
            const translation = highlightTextBetweenQuotes(example['translation']);

            const latinSentencesSection = (
                <ListItem.Title selectable={true} style={styles.latinSentenceText}>
                    {latinSentence}
                </ListItem.Title>
            )
            return (
                <ListItem.Content key={index} style={styles.definitionContainer}>
                    <ListItem.Title selectable={true} style={styles.sentenceText}>
                        {sentence}
                    </ListItem.Title>
                    {props.checkedShowLatin ? latinSentencesSection : null}
                    <ListItem.Title selectable={true} style={styles.translationText}>
                        {translation}
                    </ListItem.Title>
                </ListItem.Content>
            );
        });

        // direct word in case of alternative forms
        let selectAlternativeForm = null;
        let meaningTextStyle = [styles.meaningText];
        if (item['meaning'].includes("alternative form of")) {
            selectAlternativeForm = () => props.selectNewWord(removeAlternativeFormOf(item['meaning']));
            meaningTextStyle.push(styles.alternativeForm);
        }

        return (
            <ListItem>
                <ListItem.Content>
                    <ListItem.Title onPress={selectAlternativeForm} selectable={true} style={meaningTextStyle}>
                        {(index + 1) + '. ' + item['meaning']}
                    </ListItem.Title>
                    {examples}
                </ListItem.Content>
            </ListItem>
        );
    }

    const adygheHeader = (numberOfWords) => {
        let adygheHeaderTitle = null;
        if (numberOfWords > 0) {
            adygheHeaderTitle = (
                <Text selectable={true} style={styles.header}>
                    <Text style={styles.langHeaderText}>Western:</Text>
                </Text>
            );
        }
        return (
            <View>
                <Text selectable={true} style={styles.header}>
                    <Text style={styles.wordScreenHeaderText}>{wordObj['word']}</Text>
                    {props.checkedShowLatin ? <Text style={styles.wordInLatin}> {convertToLatin(wordObj['word'])}</Text> : null}
                    <Text>  [{wordObj['ipa']}]</Text>
                    <Text> ({wordObj['type']})</Text>
                </Text>
                <View style={styles.hr} />
                {adygheHeaderTitle}
            </View>
        )
    };

    const kabardianHeader = (numberOfWords) => {
        let kabardianHeaderTitle = null;
        if (numberOfWords > 0) {
            kabardianHeaderTitle = (
                <Text selectable={true} style={styles.header}>
                    <Text style={styles.langHeaderText}>Eastern:</Text>
                </Text>
            );
        }
        return (
            <View>
                {kabardianHeaderTitle}
            </View>
        )
    };

    const kabardianSection = () => {
        return (
            <FlatList
                ListHeaderComponent={kabardianHeader(wordObj['kbdDefinitions'].length)}
                ListFooterComponent={footerFun()}
                removeClippedSubviews={false}
                data={wordObj['kbdDefinitions']}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderDefinitions} />
        );
    };

    const footerFun = () => {
        const shapsugWord = wordObj['shapsug'] != null ? wordObj['shapsug'] : '-';
        const kabardianWord = wordObj['kabardian'] != null ? wordObj['kabardian'] : '-';
        const synonymsWords = wordObj['synonyms'] != null ? wordObj['synonyms'].join(', ') : '-';
        return (
            <View style={styles.footer}>
                <Text selectable={true} key={Math.random()} style={styles.footerText}><Text style={styles.highlight}>Synonyms</Text>: {synonymsWords}</Text>
                <Text selectable={true} style={styles.footerText}><Text style={styles.highlight}>Shapsug</Text>: {shapsugWord}</Text>
                <Text selectable={true} style={styles.footerText}><Text style={styles.highlight}>Kabardian</Text>: {kabardianWord}</Text>
            </View>
        );
    };

    return (
        <FlatList
            ListHeaderComponent={adygheHeader(wordObj['adyDefinitions'].length)}
            ListFooterComponent={kabardianSection()}
            removeClippedSubviews={false}
            data={wordObj['adyDefinitions']}
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
        paddingLeft: 10,
        paddingRight: 3
    },
    wordScreenHeaderText: {
        fontSize: 30,
        fontWeight: "bold"
    },
    langHeaderText: {
        fontSize: 25,
        fontWeight: "bold",
        textDecorationLine: 'underline'
    },
    wordInLatin: {
        fontSize: 30,
        fontWeight: "bold",
        color: '#33CC33'
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
        fontSize: 23,
        color: '#585858'
    },
    sentenceText: {
        fontSize: 19,
        color: 'black'
    },
    latinSentenceText: {
        fontSize: 19,
        color: '#33CC33',
        paddingTop: 5,
        paddingBottom: 5
    },
    translationText: {
        fontSize: 19,
        color: '#4a4a4a',
        fontStyle: 'italic'
    },
    alternativeForm: {
        color: "#00BFFF",
        textDecorationLine: 'underline'
    }
});

/**
 * a functiuon that bolds all the words that are inside a ||
 * @param {*} text - the text to bold
 */
const highlightTextBetweenQuotes = (text) => {
    const split = text.split("|");
    let result = [];
    if (split.length > 0) {
        split.forEach((part, index) => {
            if (index % 2 == 0) {
                result.push(<Text selectable={true} key={index}>{part}</Text>);
            } else {
                result.push(<Text selectable={true} key={index} style={styles.highlight}>{part}</Text>);
            }
        });
    } else {
        result = [<Text selectable={true}>{text}</Text>];
    }
    return result;
}

/**
 * a function that removes the alternative form of \"
 * @param {string} text - for words that look like: alternative form of \"мэлыко\"
 */
const removeAlternativeFormOf = (text) => {
    return text.split("\"")[1];
}

export default CircassianWordSection;
