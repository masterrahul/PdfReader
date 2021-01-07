# PdfReader
Install lib
@react-native-community/progress-bar-android
@react-native-community/progress-view
react-native-action-button
react-native-dialog-input
react-native-file-viewer
react-native-fs
react-native-pdf
react-native-print
react-native-vector-icons
rn-fetch-blob
rn-pdf-generator

Then link properly each lib
 react-native link 

Add code to app/build.gradle

  packagingOptions {
       pickFirst 'lib/x86/libc++_shared.so'
       pickFirst 'lib/x86_64/libjsc.so'
       pickFirst 'lib/arm64-v8a/libjsc.so'
       pickFirst 'lib/arm64-v8a/libc++_shared.so'
       pickFirst 'lib/x86_64/libc++_shared.so'
       pickFirst 'lib/armeabi-v7a/libc++_shared.so'
     }

Build.gradle

maven {
            url 'https://jitpack.io'
        }

Add permission manifest
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION" />
    
  <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>







