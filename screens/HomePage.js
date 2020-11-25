import { useState } from 'react';
import { SearchBar } from 'react-native-elements';
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import AutocompleteSection from './AutocompleteSection.js';
import WordSection from './WordSection.js';
import circassianDict from './../dictionary/CircassianDict.js';

const HomePage = () => {
    const [searchedText, setSearchedText] = useState('');
    const [selectedWord, setSelectedWord] = useState('шъун');
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
        setSelectedWord(newWord);
        setShowAutocomplete(false);
    }

    // filter current displayed word options
    let filteredWords = [];
    if (searchedText.length > 0) {
        circassianDict.forEach((wordObj) => {
            if (wordObj['word'].startsWith(searchedText)) {
                filteredWords.push(wordObj['word']);
            }
        });
    }

    const displayedSection = () => {
        if (showAutocomplete) {
            return <AutocompleteSection data={filteredWords}
                selectNewWord={newWordSelectionHandlder} />;
        } else if (selectedWord != '') {
            const selectedWordObj = circassianDict.find((wordObj) => {
                return wordObj['word'] === selectedWord;
            });
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
    }
});

export default HomePage;
