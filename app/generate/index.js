import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../../constants/theme';
import { wp, hp } from '../../helpers/common';

const GenerateScreen = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const handleGenerate = async () => {
        if (!prompt) {
            Alert.alert('Error', 'Please enter a prompt!');
            return;
        }

        setLoading(true);
        setGeneratedImage(null);  
        try {
            const response = await fetch('https://d080-35-204-232-128.ngrok-free.app/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate image: ${response.statusText}`);
            }

            const { image } = await response.json();  
            setGeneratedImage(`data:image/png;base64,${image}`);  

            Alert.alert('Success', 'Image generated successfully!');
        } catch (error) {
            console.error('Error:', error);  
            Alert.alert('Error', `Could not generate image: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Generate Image</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your prompt here..."
                value={prompt}
                onChangeText={setPrompt}
                multiline={true}  // Allow multiline input
                numberOfLines={4}  // Default number of lines
                textAlignVertical="top"  // Align text at the top
            />
            <Pressable style={styles.button} onPress={handleGenerate} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color={theme.colors.white} />
                ) : (
                    <View style={styles.buttonContent}>
                        <Icon name="magic" size={20} color={theme.colors.white} style={styles.icon} />
                        <Text style={styles.buttonText}>Generate</Text>
                    </View>
                )}
            </Pressable>
            {generatedImage && (
                <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(5),
        backgroundColor: theme.colors.white,
    },
    title: {
        fontSize: hp(3),
        fontWeight: 'bold',
        marginBottom: hp(1),
    },
    input: {
        width: '100%',
        padding: wp(4),
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.lg,
        marginBottom: hp(2),
        fontSize: hp(2),
        minHeight: hp(1),  // Ensure a minimum height
    },
    button: {
        backgroundColor: theme.colors.primary || '#4CAF50',  
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(10),
        borderRadius: theme.radius.md,
        alignItems: 'center',
        borderWidth: 1, 
        borderColor: 'black' 
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: wp(2),
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: hp(2),
    },
    generatedImage: {
        marginTop: hp(3),
        width: wp(85),
        height: hp(50),
        borderRadius: theme.radius.lg,
    },
});

export default GenerateScreen;
