import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

type LoginPageProps = {
  onLogin: () => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      onLogin(); // Call parent to set loggedIn = true
    } else {
      alert("Enter username and password");
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-8">
      <Text className="text-2xl font-bold mb-8">Login</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="bg-[#a259ff] rounded-lg px-8 py-3"
        onPress={handleLogin}
      >
        <Text className="text-white font-medium text-lg">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
