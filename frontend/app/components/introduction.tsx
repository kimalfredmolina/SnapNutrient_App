import { View, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type IntroductionProps = {
  onGetStarted: () => void;
};

const { width, height } = Dimensions.get('window');

export default function Introduction({ onGetStarted }: IntroductionProps) {
  const { colors, isDark } = useTheme();
  const animationRef = useRef<LottieView>(null);
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const playWithInterval = () => {
      // Play the animation
      animationRef.current?.play();
                
      setTimeout(() => {
        animationRef.current?.reset(); // Reset to beginning
        playWithInterval(); // Loop again
      }, 10000);
    };

    // Start the interval loop
    playWithInterval();

    // Start the background rotation animation
    const startBackgroundRotation = () => {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 13000, // 13 seconds for a full rotation
          useNativeDriver: true,
        })
      ).start();
    };

    startBackgroundRotation();

    // Cleanup on unmount
    return () => {
      animationRef.current?.reset();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ROTATING BACKGROUND IMAGE */}
      <Animated.Image
        source={{ uri: 'https://healthyfitnessmeals.com/wp-content/uploads/2022/09/Chicken-adobo-recipe-5.jpg' }}
        style={{
          position: 'absolute',
          width: width * 2.5,
          height: height * 2.5,
          left: -width * 0.75,
          top: -height * 0.75,
          opacity: isDark ? 0.3 : 0.8, // Dimmer in dark mode
          transform: [
            {
              rotate: rotateValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'], // CONTINUOUS CLOCKWISE ROTATION
              })
            }
          ]
        }}
        resizeMode="cover"
      />

      {/* OVERLAY FOR BETTER TEXT READABILITY */}
      <View
        style={{
          flex: 1,
          backgroundColor: isDark 
            ? 'rgba(0, 0, 0, 0.7)' // Dark overlay for dark mode
            : 'rgba(255, 255, 255, 0.7)', // White overlay for light mode
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32
        }}>
          
          {/* FORCE BIGGER WITH ZOOM/SCALE + INTERVAL */}
          <View
            style={{
              marginBottom: 32,

              width: 300, 
              height: 300, 
              overflow: 'hidden', 
            }}
          >
            <LottieView
              ref={animationRef}
              source={{ uri: 'https://cdn.lottielab.com/l/4Y3j1JUd8888CJ.json' }}
              autoPlay={false} // CONTROL
              loop={false} // HANDLE LOOPING
              speed={0.9} // SLOW DOWN ANIMATION
              style={{
                width: 200, 
                height: 200, 
                // FORCE ZOOM/SCALE HERE
                transform: [
                  { scale: 3.5 }
                ],
                marginLeft: 40,
                marginTop: 100,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
                color: colors.text,
                textShadowColor: isDark 
                  ? 'rgba(0, 0, 0, 0.8)' 
                  : 'rgba(255, 255, 255, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Welcome to{'\n'}
              <Text style={{ color: colors.primary }}>SnapNutrient!</Text>
            </Text>

            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: 16,
                color: colors.text,
                opacity: 0.8,
                textShadowColor: isDark 
                  ? 'rgba(0, 0, 0, 0.8)' 
                  : 'rgba(255, 255, 255, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}
            >
              Track your food easily with smart nutrition insights.
              Start your healthy journey today.
            </Text>
          </View>

          {/* Feature Highlights with background */}
          <View
            style={{
              marginBottom: 32,
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.9)',
              padding: 16,
              borderRadius: 12,
              shadowColor: isDark ? '#fff' : '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.2 : 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 8,
                height: 8,
                backgroundColor: colors.primary,
                borderRadius: 4,
                marginRight: 12
              }} />
              <Text style={{
                color: colors.text,
                fontSize: 16,
                opacity: 0.9
              }}>
                Instant food recognition
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 8,
                height: 8,
                backgroundColor: colors.primary,
                borderRadius: 4,
                marginRight: 12
              }} />
              <Text style={{
                color: colors.text,
                fontSize: 16,
                opacity: 0.9
              }}>
                Detailed nutrition analysis
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 8,
                height: 8,
                backgroundColor: colors.primary,
                borderRadius: 4,
                marginRight: 12
              }} />
              <Text style={{
                color: colors.text,
                fontSize: 16,
                opacity: 0.9
              }}>
                Personalized recommendations
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={{ paddingHorizontal: 32, paddingBottom: 48 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              borderRadius: 16,
              paddingHorizontal: 32,
              paddingVertical: 16,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              transform: [{ scale: 1 }], 
            }}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <Text style={{
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: 18,
              textAlign: 'center'
            }}>
              Get Started
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              marginTop: 16,
              color: colors.text,
              opacity: 0.6,
              textShadowColor: isDark 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          >
            copyright 2025 SnapNutrient
          </Text>
        </View>
      </View>
    </View>
  );
}