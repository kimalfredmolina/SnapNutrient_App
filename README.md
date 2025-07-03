# SnapNutrient_V1.0


---

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
npx expo start -c
```

- Scan the QR code with Expo Go (Android/iOS) or run on an emulator/simulator.

---

## 🛠️ Project Structure

- `app/` — Main application code (screens, components)
- `tailwind.config.js` — Tailwind/NativeWind configuration

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)

---

