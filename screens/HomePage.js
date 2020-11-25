import { useState } from 'react';
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import AutocompleteSection from './AutocompleteSection.js';
import CircassianWordSection from './CircassianWordSection.js';
import EnglishWordSection from './EnglishWordSection.js';
import circassianDict from './../dictionary/CircassianDict.js';
import englishDict from './../dictionary/EnglishDict.js';
import { SearchBar } from 'react-native-elements';

const HomePage = () => {
    const [searchedText, setSearchedText] = useState('');
    const [selectedWordObj, setSelectedWordObj] = useState({});
    const [showAutocomplete, setShowAutocomplete] = useState(false);

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
        newWord = newWord.toLowerCase();
        searchedTextLowCase = searchedText.toLowerCase();
        setShowAutocomplete(false);

        // get new word's object from the dictionary json
        let key = getJsonKey(searchedTextLowCase);
        if (getFittingDictionary(searchedTextLowCase).hasOwnProperty(key)) {
            const newWordObj = getFittingDictionary(searchedTextLowCase)[key].find((wordObj) => {
                return wordObj['searchWord'].toLowerCase() === newWord;
            });
            setSelectedWordObj(newWordObj);
        }
    }

    const isWordInEnglish = (searchedText) => {
        const firstLetter = searchedText.charAt(0).toLowerCase();
        return firstLetter.match(/[a-z]/i);
    }

    const getFittingDictionary = (searchedText) => {
        if (isWordInEnglish(searchedText)) {
            return englishDict;
        } else {
            return circassianDict;
        }
    }

    const getJsonKey = (word) => {
        if (word.length === 1) {
            return "oneLetterWords";
        } else {
            return word.substring(0, 2);
        }
    }

    // filter current displayed word options
    const getFilteredWords = () => {
        const searchedTextLowCase = searchedText.toLowerCase();
        let filteredWords = [];
        if (searchedTextLowCase.length >= 1) {
            let key = getJsonKey(searchedTextLowCase);
            if (getFittingDictionary(searchedTextLowCase).hasOwnProperty(key)) {
                getFittingDictionary(searchedTextLowCase)[key].forEach((wordObj) => {
                    if (wordObj['searchWord'].toLowerCase().startsWith(searchedTextLowCase)) {
                        filteredWords.push(wordObj['searchWord']);
                    }
                });
            }
        }
        filteredWords.sort();
        return filteredWords;
    }

    const numberOfWordsView = () => {
        let numberOfCircassianWords = 0;
        let numberOfEnglishWords = 0;
        Object.keys(circassianDict).forEach((key) => {
            numberOfCircassianWords += circassianDict[key].length;
        });
        Object.keys(englishDict).forEach((key) => {
            numberOfEnglishWords += englishDict[key].length;
        });
        return (
            <View>
                <Text style={styles.numberOfWordsText}>Number of Circassian words: {numberOfCircassianWords}</Text>
                <Text style={styles.numberOfWordsText}>Number of English words: {numberOfEnglishWords}</Text>
            </View>
        )
    }

    const autocompleteView = () => {
        return <AutocompleteSection data={getFilteredWords()}
            selectNewWord={newWordSelectionHandlder} />;
    }

    const displayedSection = () => {
        if (showAutocomplete) {
            return autocompleteView();
        } else if (Object.keys(selectedWordObj).length === 0 && selectedWordObj.constructor === Object) {
            return numberOfWordsView();
        } else {
            if (isWordInEnglish(selectedWordObj['searchWord'])) {
                return <EnglishWordSection selectedWordObj={selectedWordObj} />
            } else {
                return <CircassianWordSection selectedWordObj={selectedWordObj} />
            }
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
