import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Slide data for the preorder platform
const slides = [
  {
    title: "Discover Exclusive Product",
    text: "Browse and secure the latest products before they hit the market.",
    image: { uri: "https://example.com/path/to/preorder-slide1.png" },
  },
  {
    title: "Seamless Ordering Experience",
    text: "Place Product with ease and track your orders in real-time.",
    image: { uri: "https://example.com/path/to/preorder-slide2.png" },
  },
  {
    title: "Exclusive Deals & Rewards",
    text: "Unlock special offers and rewards for early adopters.",
    image: { uri: "https://example.com/path/to/preorder-slide3.png" },
  },
];

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get("window");

const IntroScreen = ({ navigation }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animation logic for slide transitions
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update slide index
        setSlideIndex((prev) => (prev + 1) % slides.length);
        // Reset animations
        fadeAnim.setValue(1);
        slideAnim.setValue(20);
        // Fade in and slide back
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Skip intro and navigate to main app
  const handleGetStarted = () => {
    navigation.navigate("Tabs");
  };

  return (
    <ImageBackground
      source={{ uri: "https://example.com/path/to/background.jpg" }}
      style={styles.background}
      resizeMode="cover"
      accessibilityLabel="Intro screen background"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={{ uri: "https://example.com/path/to/logo.png" }}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="App logo"
          />

          {/* Slide Content */}
          <Animated.View
            style={[
              styles.slideContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {slides[slideIndex].image && (
              <Image
                source={slides[slideIndex].image}
                style={styles.slideImage}
                resizeMode="contain"
                accessibilityLabel={slides[slideIndex].title}
              />
            )}
            <Text style={styles.title}>{slides[slideIndex].title}</Text>
            <Text style={styles.text}>{slides[slideIndex].text}</Text>
          </Animated.View>

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  index === slideIndex ? styles.activeDot : styles.inactiveDot,
                ]}
                accessibilityLabel={`Slide ${index + 1} indicator`}
              />
            ))}
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            style={styles.button}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Get started with the app"
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#fff"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginTop: height * 0.05,
  },
  slideContainer: {
    alignItems: "center",
    width: width * 0.85,
    marginBottom: height * 0.05,
  },
  slideImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E3A5F",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#4A4A4A",
    textAlign: "center",
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.03,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#1E3A5F",
  },
  inactiveDot: {
    backgroundColor: "#D3D3D3",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E3A5F",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginRight: 8,
  },
  icon: {
    marginLeft: 5,
  },
});

export default IntroScreen;