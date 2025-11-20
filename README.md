# SnapNutrient Version 1.1.4

In today’s fast-paced world, it has become more and more difficult to eat a balanced and nutritious diet. Most people find it difficult to accurately determine the nutritional value of their food and consequently end up with unintentional dietary imbalances that impact general health and well-being. The increasing prevalence of lifestyle diseases like obesity, diabetes, and cardiovascular diseases further highlights the necessity for user-friendly tools that can help make effective dietary choices.

SnapNutrient is an intelligent mobile application developed to address this growing need by providing users with real-time dietary analysis and macronutrient estimation. Based on YOLOv8, an advanced object detection algorithm, the application lets users instantly analyze meals by scanning food with their phone's camera. With the ability to detect individual foods and approximate their macronutrient content in real time, SnapNutrient fills the gap between sophisticated machine learning and common nutrition aids. This technology equips consumers with higher levels of nutritional knowledge, bringing healthy eating more within reach for everyone.

The application not only provides accurate data on macronutrients like proteins, carbohydrates, and fats but also integrates seamlessly with health trackers to offer personalized recommendations. Although tailored mainly for Filipino foods, SnapNutrient also accommodates international dishes, hence proving to be versatile for individuals with different dietary cultures and preferences.

This study highlights the development and implementation of SnapNutrient, focusing on the integration of YOLOv8 for food recognition, the design of its user-friendly interface, and its potential impact on promoting healthier dietary habits. By leveraging artificial intelligence, the project aims to contribute to global health efforts, enabling individuals to take proactive control of their nutritional intake and overall well-being.

<div align="center">
  <img src="https://github.com/user-attachments/assets/3a27deed-1200-4be8-a610-2675ab5dba69" width="300" />
  <img src="https://github.com/user-attachments/assets/aa15b89e-d049-497f-a063-1907ea605b66" width="300" />
</div>

---

## To run both Frontend and Backend

### Frontend
```bash
cd frontend
```
```bash
npx expo start --dev-client
```

### Backend
```bash
cd backend
```
```bash
python -m venv .venv
```
```bash
.\.venv\Scripts\activate
```
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## Unit Testing

### Frontend
```bash
npm test
```


### Backend
```bash
pytest --cov=.
```

## Building an APK (App)
```bash
npx expo prebuild
```

```bash
npx expo prebuild --clean    #If have changes
```

```bash
npx eas build -p android --profile production  #For Android APK
```

```bash
npx eas build -p ios --profile production  #For IOS IPA
```

## 🌟 Key Features

- 📷 Real-time food recognition using YOLOv8
- 🍽️ Instant macronutrient estimation (Calories, Protein, Carbs, Fats)
- 🧠 AI-powered dietary analysis
- 🌍 Support for local and international cuisines

## 📚 Documentation

- 📥 Install APK App in Android ([Install APK here](https://t.me/+8TwEgfD5V-RmZDc9))
- 🛠️ Expo CLI ([View Documentation](https://docs.expo.dev/more/expo-cli/))
- 🎨 Clean and user-friendly UI ([View Figma Design](https://www.figma.com/design/l02RJEt5eMlpr21sAJeOKg/UI-design?m=auto&t=Uf2Ad1lW1D1D7KCm-1))
- 📚 Expo Camera ([Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/))
- 📧 Mailer ([SendGrid](https://app.sendgrid.com/))
- 🛠️ Unit Testing (Jest)

---

# Frontend Setup

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

### 2.7 Install Expo Image Picker
```bash
npm install expo-image-picker
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
eas build --profile development --platform android  //"all" change all for both ios and android development
```

---

### Start the app

```bash
cd frontend
npx expo start --dev-client
```

- Install the APK after you build the EAS, redirect the link given from EAS or Expo build

---

# Backend Setup

### Step 1: Create an environment inside the backend first. run this

```bash
python -m venv .venv
```
And then activate it using this command
```bash
.\.venv\Scripts\activate
```

### Step 2: Install this to apply the necessary dependencies used by the model to work
```bash
pip install fastapi uvicorn ultralytics torch torchvision pillow python-multipart
```

### Step 3: Start the server by using this command
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
Then in another terminal run the frontend app

### Step 4: To check what is your IPv4 run this command in terminal and look for the IPv4
```bash
ipconfig
```

### Step 5: Add a new file inside the frontend folder and name it "server.ts" and copy paste this code and change your IPv4
```typescript
const CONFIG = {
  API_BASE_URL: "http://add ur IPv4 here:8000", //IPv4 of Model API
};

export default CONFIG;
```

## Other requirements to run the Model API

### Add this into this file android/app/src/main/AndroidManifest.xml
```xml
add this in end of the application android:name=".MainApplication" block

android:usesCleartextTraffic="true" 
```


# Git sheet

### Branch Management
```bash
git branch                 # To check all branches
git checkout branch_name   # To move to another branch
git checkout -b new_branch # To Create ne branch
```

### Status & Updates
```bash
git status    # To check the file changes
git pull      # To get the latest git commit
git pull origin branch_name   # To get the latest got commit in speciic branch
```

### Add, Commit, Push
```bash
git add .                       # To stage the all changes
git commit -m "message here"    # To create committ message
git push origin branch_name     # Push to remote repo (GitHub)
```


### Merge Workflow
```bash
git checkout master
git pull origin master          # To ensure the master is updated
git merge account_page          # Merge feature branch in master
git push origin master          # Push updated master in GitHub
```

