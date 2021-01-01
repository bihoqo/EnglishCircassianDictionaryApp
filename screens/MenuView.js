import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MenuView = (props) => {
    if (props.numberOfEnglishWords == 0) {
        return <Text style={styles.numberOfWordsText}>Loading...</Text>
    } else {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <Text selectable={true} style={styles.homePageTitle}>
                        The English-Circassian dictionary
                    </Text>
                    <Text selectable={true} style={styles.numberOfWordsText}>
                        Number of Western words: {props.numberOfAdygheWords}
                    </Text>
                    <Text selectable={true} style={styles.numberOfWordsText}>
                        Number of Eastern words: {props.numberOfKabardianWords} from Amjad Jaimoukha's dictionary
                    </Text>
                    <Text selectable={true} style={styles.numberOfWordsText}>
                        Number of English words: {props.numberOfEnglishWords}
                    </Text>
                    <Text selectable={true} style={styles.numberOfWordsText}>
                        To search for words with the letter palochka "ӏ" you can use "1" instead, for example searching "к1алэ" instead of "кӏалэ".
                    </Text>
                </ScrollView>
                <View><Text style={styles.versionText}>{props.version}</Text></View>
            </View>
        );
    }
}

export default MenuView;

const styles = StyleSheet.create({
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
