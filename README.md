# SnapNutrient Macro Scanner and Dietary Analytics

In today’s fast-paced world, it has become more and more difficult to eat a balanced and nutritious diet. Most people find it difficult to accurately determine the nutritional value of their food and consequently end up with unintentional dietary imbalances that impact general health and well-being. The increasing prevalence of lifestyle diseases like obesity, diabetes, and cardiovascular diseases further highlights the necessity for user-friendly tools that can help make effective dietary choices.

SnapNutrient is an intelligent mobile application developed to address this growing need by providing users with real-time dietary analysis and macronutrient estimation. Based on YOLOv8, an advanced object detection algorithm, the application lets users instantly analyze meals by scanning food with their phone's camera. With the ability to detect individual foods and approximate their macronutrient content in real time, SnapNutrient fills the gap between sophisticated machine learning and common nutrition aids. This technology equips consumers with higher levels of nutritional knowledge, bringing healthy eating more within reach for everyone.

The application not only provides accurate data on macronutrients like proteins, carbohydrates, and fats but also integrates seamlessly with health trackers to offer personalized recommendations. Although tailored mainly for Filipino foods, SnapNutrient also accommodates international dishes, hence proving to be versatile for individuals with different dietary cultures and preferences.

This study highlights the development and implementation of SnapNutrient, focusing on the integration of YOLOv8 for food recognition, the design of its user-friendly interface, and its potential impact on promoting healthier dietary habits. By leveraging artificial intelligence, the project aims to contribute to global health efforts, enabling individuals to take proactive control of their nutritional intake and overall well-being.

---

<h2 id="figma">Figma Design 🎨</h2>

[Figma Design](https://www.figma.com/design/l02RJEt5eMlpr21sAJeOKg/UI-design?m=auto&t=Uf2Ad1lW1D1D7KCm-1&fbclid=IwY2xjawLi8SFleHRuA2FlbQIxMABicmlkETFObmVRbHRJUDFYbGo5eG1yAR59iSrClhieHeaj-wdgE55Oxy4OETaTl-17ZFPGAa3Sni4oVaKV9IutZhs47w_aem_YLF0-ZmQ0vCtuf9Ot9Qtpg
).

## 🚀 Getting Started

### 0. Install Expo CLI (if you don't have it)

```bash
npm install -g expo-cli
```

### 1. Install project components (dont need to install)

```bash
npx create-expo-app@latest
```

### 2. Install project dependencies

```bash
npm install
```

### 3. Install project dependencies

```bash
npm install expo
```

---
## Other Installation (Already install in our project)

### 4. Install Tailwind CSS (for NativeWind) [Guide](https://www.nativewind.dev/docs/getting-started/installation).

```bash
npx expo install nativewind react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
npx expo install tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 -- -D
npx tailwindcss init
```

### 5. To remove other not neccesary files

```bash
npm run reset-project
```

> **Note:** The `tailwind.config.js` is already set up for this project.  
> Make sure your `content` array includes all files with NativeWind classes:
>
> ```js
> content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"];
> ```

---
### 6. Start the app

```bash
cd frontend
npx expo start --dev-client
```

- Scan the QR code with Expo Go (Android/iOS) or run on an emulator/simulator.

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

