# SnapNutrient V1.0.0

In today’s fast-paced world, it has become more and more difficult to eat a balanced and nutritious diet. Most people find it difficult to accurately determine the nutritional value of their food and consequently end up with unintentional dietary imbalances that impact general health and well-being. The increasing prevalence of lifestyle diseases like obesity, diabetes, and cardiovascular diseases further highlights the necessity for user-friendly tools that can help make effective dietary choices.

SnapNutrient is an intelligent mobile application developed to address this growing need by providing users with real-time dietary analysis and macronutrient estimation. Based on YOLOv8, an advanced object detection algorithm, the application lets users instantly analyze meals by scanning food with their phone's camera. With the ability to detect individual foods and approximate their macronutrient content in real time, SnapNutrient fills the gap between sophisticated machine learning and common nutrition aids. This technology equips consumers with higher levels of nutritional knowledge, bringing healthy eating more within reach for everyone.

The application not only provides accurate data on macronutrients like proteins, carbohydrates, and fats but also integrates seamlessly with health trackers to offer personalized recommendations. Although tailored mainly for Filipino foods, SnapNutrient also accommodates international dishes, hence proving to be versatile for individuals with different dietary cultures and preferences.

This study highlights the development and implementation of SnapNutrient, focusing on the integration of YOLOv8 for food recognition, the design of its user-friendly interface, and its potential impact on promoting healthier dietary habits. By leveraging artificial intelligence, the project aims to contribute to global health efforts, enabling individuals to take proactive control of their nutritional intake and overall well-being.

---

## 🌟 Key Features

- 📷 Real-time food recognition using YOLOv8
- 🍽️ Instant macronutrient estimation (Protein, Carbs, Fats)
- 🧠 AI-powered dietary analysis
- 🌍 Support for local and international cuisines

## 📚 Documentation 
- 🛠️ Expo CLI ([View Documentation](https://docs.expo.dev/more/expo-cli/))
- 🎨 Clean and user-friendly UI ([View Figma Design](https://www.figma.com/design/l02RJEt5eMlpr21sAJeOKg/UI-design?m=auto&t=Uf2Ad1lW1D1D7KCm-1))
- 📚 Expo Camera ([Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/))

---

## 🚀 Getting Started Project Installation

### 1.0. Install Expo CLI (if you don't have it)

```bash
npm install -g expo-cli
```

### 1.1 Install project components (dont need to install)

```bash
npx create-expo-app@latest
```

### 1.2 Install project dependencies

```bash
npm install
```

### 1.3 Install project dependencies

```bash
npm install expo
```

### 1.4 For .env file for API keys (need)

```bash
npx expo install expo-constants
```

---

## Other Installation (Already install in our project)

### 2.1 Install Tailwind CSS (for NativeWind) [Guide](https://www.nativewind.dev/docs/getting-started/installation).

```bash
npx expo install nativewind react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
npx expo install tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 -- -D
npx tailwindcss init
```

### 2.2 To remove other not neccesary files

```bash
npm run reset-project
```

### 2.3 Install SVG and use for Chart

```bash
npx expo install react-native-svg
```

### 2.4 Install Firebase

```bash
npx expo install firebase
```

### 2.5 Install Expo Camera

```bash
npx expo install expo-camera
```

### 2.6 Install React Native Calendar

```bash
npm install react-native-calendars
```

---

## EAS Installation and Setup

### 3.1 EAS Account

```bash
npm install -g eas-cli
eas login
```


### 3.2 Install this to build or rebuild the app after installing native modules

```bash
eas build --profile development --platform android  //all
```

---

### Start the app

```bash
cd frontend
npx expo start --dev-client
```

- Install the APK after you build the EAS, redirect the link given from EAS or Expo build

---

## 🛠️ Project Structure

- `app/` — Main application code (screens, components)
- `tailwind.config.js` — Tailwind/NativeWind configuration
- backend

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)

---
