import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input, CheckBox} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default class SingUp extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      checked: false,
      uid: '',
    };
  }
  handleEmail = (text) => {
    this.setState({email: text});
  };
  handlePassword = (text) => {
    this.setState({password: text});
  };
  handleName = (text) => {
    this.setState({name: text});
  };
  onPressCheckBox = () => {
    this.setState({checked: true});
  };

  onPressLogin = (email, password, name) =>
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const uidGet = auth().currentUser.uid;
        this.setState({uid: uidGet});

        firestore().collection('Users').doc(uidGet).set({
          uid: this.state.uid,
          email: this.state.email,
          name: this.state.name,
          userType: 'user',
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('Bu email adresi zaten kullanılıyor');
        }

        if (error.code === 'auth/invalid-email') {
          alert('Lütfen geçerli bir email adresi yazın');
        }
        if (error.code === 'auth/weak-password') {
          alert('Parolanız zayıf!');
        }

        console.error(error);
      });
  render() {
    return (
      <ImageBackground
        source={require('./assets/loginbg.jpg')}
        style={styles.bgimage}>
        <Image style={styles.tinyLogo} source={require('./assets/logod.png')} />
        <ScrollView>
          <TextInput
            placeholder="İsim"
            onChangeText={this.handleName}
            style={styles.input}></TextInput>
          <TextInput
            placeholder="Email"
            textContentType="emailAddress"
            autoCapitalize="none"
            returnKeyType={'next'}
            onChangeText={this.handleEmail}
            style={styles.input}></TextInput>
          <TextInput
            placeholder="Şifre"
            secureTextEntry={true}
            onChangeText={this.handlePassword}
            style={styles.input}></TextInput>

          <CheckBox
            center
            title="Kullanım şartlarını onaylıyorum"
            backgroundColor="blue"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={this.state.checked}
            onPress={this.onPressCheckBox}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              this.onPressLogin(
                this.state.email,
                this.state.password,
                this.state.name,
              )
            }>
            <Text style={styles.loginText}>GİRİŞ</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  bgimage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  input: {
    width: '100%',
    height: 50,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#c5d7e8',
    opacity: 0.8,
    color: '#000000',
    padding: 10,
  },
  loginText: {textAlign: 'center'},
  loginButton: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 20,
  },
  tinyLogo: {
    height: 150,
    width: 150,
    marginTop: 50,
    alignSelf: 'center',
    opacity: 0.7,
    marginBottom: 120,
  },
});
