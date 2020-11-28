import { useState, useEffect } from 'react';
import React from 'react';
import { View, Text, StyleSheet, ToastAndroid, StatusBar, BackHandler, Alert, ScrollView } from 'react-native';
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
    const [historyOfSearchedWords, setHistoryOfSearchedWords] = useState([]);
    const [numberOfEnglishWords, setNumberOfEnglishWords] = useState(0);
    const [numberOfCircassianWords, setNumberOfCircassianWords] = useState(0);

    const appVersion = "v1.0";

    /**
     * a function that handles the phone's back button press event
     */
    const backAction = () => {
        // check if there is word selection history to go back to,
        // if there's no history, exist the app otherwise go back to the previous word
        if (historyOfSearchedWords.length < 2) {
            Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
        } else {
            const historyArray = [...historyOfSearchedWords];
            historyArray.pop();
            setHistoryOfSearchedWords(historyArray);
            setSelectedWordObj(historyArray[historyArray.length - 1]);
        }
        return true;
    };

    // handle the phone's back button press event
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [historyOfSearchedWords]);

    // calculate the number words in both Circassian and English dictionaries
    useEffect(() => {
        let cirWords = 0;
        let engWord = 0;
        Object.keys(circassianDict).forEach((key) => {
            cirWords += circassianDict[key].length;
        });
        setNumberOfCircassianWords(cirWords);
        Object.keys(englishDict).forEach((key) => {
            engWord += englishDict[key].length;
        });
        setNumberOfEnglishWords(engWord);
    }, []);

    /**
     * a funciton that handles the inserted text in the search bar
     * @param {string} insertedText - the inserted text in the search-bar
     */
    const updateSearch = (insertedText) => {
        setSearchedText(insertedText)
        if (insertedText.length > 0) {
            setShowAutocomplete(true);
        } else {
            setShowAutocomplete(false);
        }
    };

    /**
     * a function that handles selecting a word to display
     * @param {string} newWord - new word to select
     */
    const newWordSelectionHandlder = (newWord) => {
        newWord = newWord.toLowerCase().trim();
        setShowAutocomplete(false);

        // get new word's object from the dictionary json
        let key = getJsonKey(newWord);
        if (getFittingDictionary(newWord).hasOwnProperty(key)) {
            const newWordObj = getFittingDictionary(newWord)[key].find((wordObj) => {
                return wordObj['word'].toLowerCase() === newWord;
            });
            if (newWordObj == undefined) {
                showToastWithText(newWord);
            } else {
                setSelectedWordObj(newWordObj);

                // add new selected wordObj to history
                const historyArray = [...historyOfSearchedWords];
                historyArray.push(newWordObj);
                setHistoryOfSearchedWords(historyArray);
            }
        } else {
            showToastWithText(newWord);
        }
    }

    /**
     * a function that shows a toast with the given tex value
     * @param {string} textToDisplay - text to display in the toast
     */
    const showToastWithText = (textToDisplay) => {
        const message = "Couldn't find the word: " + textToDisplay;
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    };

    /**
     * a funtion that checks if the given word is in the English language,
     * the way the function determines that is, it checks if the given word
     * starts in the latin alphabat
     * @param {string} wordToCheck - the word to check
     */
    const isWordInEnglish = (wordToCheck) => {
        const firstLetter = wordToCheck.charAt(0).toLowerCase();
        return firstLetter.match(/[a-z]/i);
    }

    /**
     * a function that checks if the given word is in English or Circassian,
     * and returns the appropiate dictionary json
     * @param {string} wordToCheck - the word to check from which dictionary it is
     */
    const getFittingDictionary = (wordToCheck) => {
        if (isWordInEnglish(wordToCheck)) {
            return englishDict;
        } else {
            return circassianDict;
        }
    }

    /**
     * a function that recieves a word and returns the json
     * key it is belong to in the dictionary json
     * @param {string} word - the word to check
     */
    const getJsonKey = (word) => {
        if (word.length === 1) {
            return "oneLetterWords";
        } else {
            return word.substring(0, 2);
        }
    }

    /**
     * a funtion that returns the autocomplete options in the search-bar
     * @param {string} text - the text that was inserted inside the search-bar
     */
    const getFilteredWordsInAutocomplete = (text) => {
        text = text.toLowerCase().trim().split("1").join("ӏ");
        let filteredWords = [];
        if (text.length >= 1) {
            let key = getJsonKey(text);
            if (getFittingDictionary(text).hasOwnProperty(key)) {
                getFittingDictionary(text)[key].forEach((wordObj) => {
                    if (wordObj['word'].toLowerCase().startsWith(text)) {
                        filteredWords.push(wordObj['word']);
                    }
                });
            }
        }
        filteredWords.sort();
        return filteredWords;
    }

    /**
     * a function that returns a View which contains the number of words
     * there are in both English & Circassian dicitonary
     */
    const numberOfWordsView = () => {
        if (numberOfEnglishWords == 0) {
            return <Text style={styles.numberOfWordsText}>Loading...</Text>
        }
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <Text selectable={true} style={styles.homePageTitle}>The English-Circassian dicitonary</Text>
                    <Text selectable={true} style={styles.numberOfWordsText}>Number of Circassian words: {numberOfEnglishWords}</Text>
                    <Text selectable={true} style={styles.numberOfWordsText}>Number of English words: {numberOfCircassianWords}</Text>
                </ScrollView>
                <View><Text style={styles.versionText}>{appVersion}</Text></View>
            </View>
        )
    }

    /**
     * a function that returns the AutocompleteSection component with its fitting parameters
     */
    const autocompleteView = () => {
        return <AutocompleteSection data={getFilteredWordsInAutocomplete(searchedText)}
            selectNewWord={newWordSelectionHandlder} />;
    }

    /**
     * a function that returns either the English or Circacssian WordSection component,
     * containing the details of the selected word 
     */
    const displayedSection = () => {
        if (showAutocomplete) {
            return autocompleteView();
        } else if (Object.keys(selectedWordObj).length === 0 && selectedWordObj.constructor === Object) {
            return numberOfWordsView();
        } else {
            if (isWordInEnglish(selectedWordObj['word'])) {
                return <EnglishWordSection selectNewWord={newWordSelectionHandlder} selectedWordObj={selectedWordObj} />
            } else {
                return <CircassianWordSection selectNewWord={newWordSelectionHandlder} selectedWordObj={selectedWordObj} />
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
    },
    homePageTitle: {
        padding: 20,
        fontSize: 26,
        fontWeight: "bold"
    },
    versionText: {
        textAlign: 'right',
        alignSelf: 'stretch',
        color: "gray",
        fontSize: 20,
        padding: 10
    }
});

export default HomePage;
