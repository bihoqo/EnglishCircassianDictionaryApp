import { useState } from 'react';
import { SearchBar } from 'react-native-elements';
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import AutocompleteSection from './AutocompleteSection.js';
import WordSection from './WordSection.js';
import circassianDict from './../dictionary/CircassianDict.js';

const HomePage = () => {
    const [searchedText, setSearchedText] = useState('');
    const [selectedWordObj, setSelectedWordObj] = useState({});
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    const words = ['Adam', 'John', 'Dina', 'Saw', 'Zed'];

    // a funciton that handles the inserted text in the search bar
    const updateSearch = (insertedText) => {
        setSearchedText(insertedText)
        if (insertedText.length > 0) {
            setShowAutocomplete(true);
        } else {
            setShowAutocomplete(false);
        }
    };

    const newWordSelectionHandlder = (newWord) => {
        setShowAutocomplete(false);

        // get new word's object from the dictionary json
        let key = getJsonKey(searchedText);
        const newWordObj = circassianDict[key].find((wordObj) => {
            return wordObj['word'] === newWord;
        });
        console.log(newWordObj);
        setSelectedWordObj(newWordObj);
    }

    const getJsonKey = (word) => {
        if (word.length === 1) {
            return "oneLetterWords";
        } else {
            return word.substring(0, 2);
        }
    }

    // filter current displayed word options
    let filteredWords = [];
    if (searchedText.length >= 1) {
        try {
            let key = getJsonKey(searchedText);
            circassianDict[key].forEach((wordObj) => {
                if (wordObj['word'].startsWith(searchedText)) {
                    filteredWords.push(wordObj['word']);
                }
            });
        } catch (arr) {
            console.log(arr);
        }
    }

    const displayedSection = () => {
        if (showAutocomplete) {
            return <AutocompleteSection data={filteredWords}
                selectNewWord={newWordSelectionHandlder} />;
        } else if (Object.keys(selectedWordObj).length === 0 && selectedWordObj.constructor === Object) {
            let numberOfWords = 0;
            Object.keys(circassianDict).forEach((key) => {
                numberOfWords += circassianDict[key].length;
            });
            return <Text style={styles.numberOfWordsText}>Number of Circassian words: {numberOfWords}</Text>
        } else {
            return <WordSection selectedWordObj={selectedWordObj} />
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.statusBarHeight}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="gray" translucent={true} />
            </View>
            <SearchBar
                lightTheme
                placeholder="Type Here..."
                onChangeText={updateSearch}
                value={searchedText}
            />
            {displayedSection()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40
    },
    statusBarHeight: {
        height: (Platform.OS === 'ios') ? 20 : StatusBar.currentHeight
    },
    numberOfWordsText: {
        padding: 20,
        fontSize: 20
    }
});

export default HomePage;
