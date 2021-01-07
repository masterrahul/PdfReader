import React from 'react';
import { StyleSheet, Dimensions, View, Text, PermissionsAndroid, Alert } from 'react-native';

import Pdf from 'react-native-pdf';
import PDFGenerator from 'rn-pdf-generator';
import PDF from 'rn-pdf-generator';
import RNPrint from 'react-native-print';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob'
import {
  writeFile, appendFile, copyFile,
  DownloadDirectoryPath, DocumentDirectoryPath
} from 'react-native-fs';
const DDP = DocumentDirectoryPath + "/";
import FileViewer from 'react-native-file-viewer';
import DialogInput from 'react-native-dialog-input';

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      uri: '',
      numberOfPages: 0,
      currentPage: 0,
      filePath: '',
      isDialogVisible: false,
      initurl: 'https://cesarvr.io/post/2018-05-22-create-containers/',
      inithtml: '<h1>PDF TEST</h1>',
      htmldialog: false
    }

  }

  //base64 pdf
  generateDocument(value, type) {
    if (type == "url") {
      PDFGenerator.fromURL(value)
        .then((data) => {
          console.log(data)
          this.setState({ uri: `data:application/pdf;base64,${data}` })
        })
        .catch(err => {
          console.log('error->', err)
        })
    } else {
      PDF.fromHTML(value, `http://localhost`)
        .then((data) => {
          console.log(data)
          this.setState({ uri: `data:application/pdf;base64,${data}` })
        })
        .catch(err => {
          console.log('error->', err)
        })
    }

  }


  //permission
  requestRunTimePermission = () => {
    var that = this;
    async function externalStoragePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data.',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          that.saveFile();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        Alert.alert('Write permission err', err);
        console.warn(err);
      }
    }

    if (Platform.OS === 'android') {
      externalStoragePermission();
    } else {
      this.saveFile();
    }
  }

  // save pdf
  saveFile() {
    var RNFS = require('react-native-fs');
    const fs = RNFetchBlob.fs
    var splitArray = this.state.filePath.split("/");

    var fileName = splitArray[splitArray.length - 1]
    console.log(fileName)
    var path = RNFS.DownloadDirectoryPath + '/' + fileName;

    fs.writeFile(path, this.state.filePath, 'uri')
      .then(() => {

        Alert.alert(
          "File Saved Successfully!",
          fileName,
          [
            {
              text: "Close",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "Open", onPress: () => {
                FileViewer.open(path)
              }
            }
          ],
          { cancelable: false }
        );



        console.log('FILE WRITTEN!');


      })
      .catch((err) => {
        console.log("SaveFile()", err.message);
        alert(err.message)
      });


  }

  //send data to generate pdf
  sendInput(url) {
    if (url != '') {
      this.generateDocument(url, 'url')
    }
    this.setState({
      isDialogVisible: false
    })
  }
  sendhtml(html) {
    if (html != '') {
      this.generateDocument(html, 'html')
    }
    this.setState({
      htmldialog: false
    })
  }

  render() {

    const { currentPage, numberOfPages } = this.state

    return (
      <View style={styles.container}>
        <View style={{
          backgroundColor: 'red',
          padding: 10,
          alignItems: "center"
        }}>
          <Text
            style={{
              color: '#fff', fontSize: 18,
              fontWeight: 'bold'
            }}
          >Pdf Reader App</Text>
        </View>

        <Pdf
          source={this.state}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
            this.setState({
              numberOfPages: numberOfPages,
              filePath: filePath
            })
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
            this.setState({
              currentPage: page,

            })
          }}
          onError={(error) => {
            console.log(error);
          }}
          enablePaging={true}
          horizontal={true}
          style={styles.pdf} />

        <ActionButton buttonColor="rgba(231,76,60,1)"
          useNativeFeedback={false}
        >
          <ActionButton.Item buttonColor='#9b59b6' title="Load from url"
            onPress={() => {
              this.setState({
                inithtml: '<h1>PDF TEST</h1>',
                htmldialog: true
              })
            }
            }>
            <Icon name="cloud-download-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' title="Load from html"
            onPress={() => {
              this.setState({
                initurl: 'https://cesarvr.io/post/2018-05-22-create-containers/',
                isDialogVisible: true
              })
            }}>
            <Icon name="code-slash" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Print pdf"
            onPress={async () => await await RNPrint.print({ filePath: this.state.filePath })}
          >
            <Icon name="print" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Save pdf"
            onPress={() => {
              this.requestRunTimePermission()

            }}>
            <Icon name="save" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>


        <View
          style={{
            position: "absolute",
            bottom: 10,
            alignSelf: "center",
            backgroundColor: "#ccc",
            padding: 7,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: "center"

          }}
        >
          <Text
            style={{

              color: '#fff',
              fontSize: 15,

            }}
          >{currentPage} of {numberOfPages}</Text>
        </View>


        <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"PDF from url"}
          message={"Enter pdf url"}
          hintInput={"url"}
          initValueTextInput={this.state.initurl}
          submitInput={(inputText) => { this.sendInput(inputText) }}
          closeDialog={() => {
            this.setState({
              isDialogVisible: false
            })
          }}

        />

        <DialogInput isDialogVisible={this.state.htmldialog}
          title={"PDF from html"}
          message={"Enter pdf html"}
          hintInput={"html"}
          initValueTextInput={this.state.inithtml}
          submitInput={(inputText) => { this.sendhtml(inputText) }}
          closeDialog={() => {
            this.setState({
              htmldialog: false
            })
          }}

        />





      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});