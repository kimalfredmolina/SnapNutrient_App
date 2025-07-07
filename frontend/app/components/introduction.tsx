import { View, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';

type IntroductionProps = {
  onGetStarted: () => void;
};

const { width, height } = Dimensions.get('window');

export default function Introduction({ onGetStarted }: IntroductionProps) {
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
    <View style={{ flex: 1 }}>
      {/* ROTATING BACKGROUND IMAGE */}
      <Animated.Image
  source={{ uri: 'https://healthyfitnessmeals.com/wp-content/uploads/2022/09/Chicken-adobo-recipe-5.jpg' }} // ITO MUNA
  style={{
    position: 'absolute',
    width: width * 2.5,        
    height: height * 2.5,      
    left: -width * 0.75,       
    top: -height * 0.75,      
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
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // White overlay with transparency
        }}
      >
        <View className="flex-1 justify-center items-center px-8">
          
          {/* FORCE BIGGER WITH ZOOM/SCALE + INTERVAL */}
          <View 
            className="mb-8"
            style={{
              // Container with overflow hidden for cropping
              width: 300,                    // Visible area
              height: 300,                   // Visible area
              overflow: 'hidden',            // Crop the scaled animation
            }}
          >
            <LottieView
              ref={animationRef}                   
              source={{ uri: 'https://cdn.lottielab.com/l/4Y3j1JUd8888CJ.json' }}
              autoPlay={false}                      // CONTROL
              loop={false}                          // HANDLE LOOPING
              speed={0.9}                           // SLOW DOWN ANIMATION
              
              style={{
                width: 200,                  // Original size
                height: 200,                 // Original size
                
                // FORCE ZOOM/SCALE HERE 
                transform: [
                  { scale: 3.5 }             
                ],
                
                // Position the scaled animation
                marginLeft: 40,            
                marginTop: 100,              
              }}
              
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View className="items-center mb-12">
            <Text 
              className="text-4xl font-bold text-center mb-4"
              style={{ 
                color: '#1f2937',
                textShadowColor: 'rgba(255, 255, 255, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Welcome to{'\n'}
              <Text className="text-[#a259ff]">SnapNutrient!</Text>
            </Text>
            
            <Text 
              className="text-lg text-center leading-6 px-4"
              style={{ 
                color: '#374151',
                textShadowColor: 'rgba(255, 255, 255, 0.8)',
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
            className="mb-8 space-y-3"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: 16,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-[#a259ff] rounded-full mr-3" />
              <Text className="text-gray-700 text-base">Instant food recognition</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-[#a259ff] rounded-full mr-3" />
              <Text className="text-gray-700 text-base">Detailed nutrition analysis</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-[#a259ff] rounded-full mr-3" />
              <Text className="text-gray-700 text-base">Personalized recommendations</Text>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="px-8 pb-12">
          <TouchableOpacity
            className="rounded-2xl px-8 py-4 active:scale-95"
            style={{
              backgroundColor: '#a259ff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Get Started
            </Text>
          </TouchableOpacity>
          
          <Text 
            className="text-sm text-center mt-4"
            style={{ 
              color: '#6b7280',
              textShadowColor: 'rgba(255, 255, 255, 0.8)',
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