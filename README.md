# 370scanster
Welcome to SCANster! In this readme, we will describe how to install the necessary dependencies and start the demo. Note that you need to have a mac with XCode 10 installed to run our app. Windows is not supported since this is an iOS application.
# 1. Expo-cli and React-Native-Cli
To run our app, it is necessary to have expo-cli and react-native-cli. It is fairly easy to install them by following the instructions below: 
## Node.js
If you don't have Node.js installed, follow [this link](https://nodejs.org/en/download/) to install. 
## Expo
[Expo isntallation](https://docs.expo.io/versions/latest/introduction/installation) 
## React Native
[React Native Installation](https://facebook.github.io/react-native/docs/getting-started) 

# 2. CocoaPods
Since we use CocoaPods to manage all our dependencies, it is necessary to have it installed. Follow [this link](https://cocoapods.org/) to install if you haven't. 

# 3. Installing dependencies
Navigate to our project root directory and run this:  
```
npm install
```
After this is complete, navigate to ios/ directory. You should see a file called Podfile. With this file present, run this:
```
pod install
```
After this is complete, double-click Scanster.xcworkspace or open this workspace from XCode. Then navigate back to the root directory.

# 4. Build and run
Make sure you are in the root directory. Also, make sure XCode open the workspace correctly. You should see Scanster as well as Pods in the workspace. After all the depencies are installed, you are ready to start running our app. There are a few things to keep in mind:
* Make sure you open the Scanster.xcworkspace, not Scanster.xcodeproj. The latter won't be able to find the dependencies from the Podfile and will fail to build.
* You need to have XCode 10. Other versions of XCode are not tested by our team.
* If you run with simulator, the camera preview is not supported.
* To run our app on your device, make sure the mobile device and your computer are under the same network. This is crucial and if they are not on the same network, the built package won't be able to communicate with the development server.     
  
To start our app, you need to do two things:
1. Run `expo start` in the terminal
2. At the mean while, click on `Build` in the XCode.
If all goes well, XCode will install our app to the simulator or your mobile device. You might need to permit the installation in your settings. Follow the prompt messages and it should install.
