import { useState, useEffect } from 'react';
import * as React from 'react';
import { View, StyleSheet, ToastAndroid, StatusBar, BackHandler, Alert } from 'react-native';
import AutocompleteSection from './AutocompleteSection.js';
import SettingsSection from './SettingsSection.js';
import CircassianWordSection from './CircassianWordSection.js';
import EnglishWordSection from './EnglishWordSection.js';
import MenuView from './MenuView.js';
import circassianDict from './../dictionary/CircassianDict.js';
import englishDict from './../dictionary/EnglishDict.js';
import { Searchbar } from 'react-native-paper';
import { isWordInEnglish } from './GlobalFunctions.js';

const HomePage = () => {
    const [searchedText, setSearchedText] = useState('');
    const [selectedWordObj, setSelectedWordObj] = useState({});
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [checkedShowLatin, setCheckedShowLatin] = useState(false);
    const [historyOfSearchedWords, setHistoryOfSearchedWords] = useState([]);
    const [numberOfEnglishWords, setNumberOfEnglishWords] = useState(0);
    const [numberOfCircassianWords, setNumberOfCircassianWords] = useState(0);

    const appVersion = "v1.0.5";

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

    const changeCheckedShowLatin = () => {
        setCheckedShowLatin(!checkedShowLatin);
    }

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

    // handle the phone's back button press event
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [historyOfSearchedWords]);

    /**
     * a funciton that handles the inserted text in the search bar
     * @param {string} insertedText - the inserted text in the search-bar
     */
    const updateSearch = (insertedText) => {
        setShowSettings(false);
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
            let regular = [], get = [], be = [], become = [];
            regular = getWordsFromDictionaryThatStartWith(text);
            if (text.length >= 2) {
                get = text.startsWith('get ') ? [] : getWordsFromDictionaryThatStartWith("get " + text);
                become = text.startsWith('become ') ? [] : getWordsFromDictionaryThatStartWith("become " + text);
                be = text.startsWith('be ') ? [] : getWordsFromDictionaryThatStartWith("be " + text);
            }
            filteredWords = [...regular, ...get, ...become, ...be];
            filteredWords.sort();
        }
        return filteredWords;
    }

    const getWordsFromDictionaryThatStartWith = (word) => {
        let wordsToReturn = [];
        const key = getJsonKey(word);
        if (getFittingDictionary(word).hasOwnProperty(key)) {
            getFittingDictionary(word)[key].forEach((wordObj) => {
                if (wordObj['word'].toLowerCase().startsWith(word)) {
                    wordsToReturn.push(wordObj['word']);
                }
            });
        }
        return wordsToReturn;
    }

    /**
     * a function that returns a View which contains the number of words
     * there are in both English & Circassian dicitonary
     */
    const numberOfWordsView = () => {
        return <MenuView
            numberOfCircassianWords={numberOfCircassianWords}
            numberOfEnglishWords={numberOfEnglishWords}
            version={appVersion} />;
    }

    /**
     * a function that returns the AutocompleteSection component with its fitting parameters
     */
    const autocompleteView = () => {
        return <AutocompleteSection
            checkedShowLatin={checkedShowLatin}
            data={getFilteredWordsInAutocomplete(searchedText)}
            selectNewWord={newWordSelectionHandlder} />;
    }

    /**
     * a function that returns the SettingsSection component
     */
    const settingsView = () => {
        return <SettingsSection
            goBack={setShowSettings}
            checkedShowLatin={checkedShowLatin}
            changeCheckedShowLatin={changeCheckedShowLatin} />;
    }

    /**
     * a function that returns either the English or Circacssian WordSection component,
     * containing the details of the selected word 
     */
    const displayedSection = () => {
        if (showSettings) {
            return settingsView();
        } else if (showAutocomplete) {
            return autocompleteView();
        } else if (Object.keys(selectedWordObj).length === 0 && selectedWordObj.constructor === Object) {
            return numberOfWordsView();
        } else {
            if (isWordInEnglish(selectedWordObj['word'])) {
                return <EnglishWordSection
                    checkedShowLatin={checkedShowLatin}
                    selectNewWord={newWordSelectionHandlder}
                    selectedWordObj={selectedWordObj} />
            } else {
                return <CircassianWordSection
                    checkedShowLatin={checkedShowLatin}
                    selectNewWord={newWordSelectionHandlder}
                    selectedWordObj={selectedWordObj} />
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }} style={styles.statusBarHeight}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="gray" translucent={true} />
            </View>
            <View style={{ flex: 1 }} style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={updateSearch}
                        value={searchedText}
                        icon={{ source: 'settings', direction: 'auto' }}
                        onIconPress={() => setShowSettings(!showSettings)}
                    />
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {displayedSection()}
            </View>
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
    iconContainer: {
        backgroundColor: 'gray',
        padding: 10
    }
});


export default HomePage;
