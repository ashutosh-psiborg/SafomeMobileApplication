import {
    View,
    Text,
    Image,
    Pressable,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Dimensions,
    Linking
  } from "react-native";
  import React, { useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import COLORS from "../constants/colors";
  import { Ionicons } from "@expo/vector-icons";
  import { useFonts } from "expo-font";
  import { AuthContext } from "../context/AuthContext";
  import { apiPostMethod } from "../constants/apiService";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useContext ,useEffect} from "react";
  import Button from "../components/SignupLoginButton";
  import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from "@react-native-google-signin/google-signin";
  const { width, height } = Dimensions.get("window");
  
  const Signup = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [signUpData, setSignUpData] = useState({});
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    console.log("width", width, "height", height);
    const [loginResponse, setLoginResponse] = useState(null); // State to store login response
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    // const nav = useNavigation();
    const configGoogleSignIn = () => {
      GoogleSignin.configure({
        webClientId:
          "279947723368-btl11pfv71scj1hs4nga0pllpb99cq72.apps.googleusercontent.com",
      });
    };
    
    useEffect(() => {
      configGoogleSignIn();
    }, []);
  
    const signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const res = await GoogleSignin.signIn();
        const { idToken } = res;
        const payload = {
          token: idToken,
        };
        // Debugging: Log idToken and response
        console.log("Google Sign-In ID Token:", idToken);
    
        // Use idToken to authenticate with your backend
        const response = await apiPostMethod("googleLogin",payload);
    
        // Debugging: Log the full response from the backend
        console.log("Backend Response:", response);
    
        // Extract necessary data from response
        const data = response?.data?.data;
        if (!data) {
          throw new Error("Invalid response structure");
        }
    
        const {
          userId,
          token,
          banner,
          avatar,
          userType,
          firstName,
          lastName,
          termAndCondition,
        } = data;
    
        if (!userId || !token) {
          throw new Error("Missing user ID or token");
        }
    
        const userDetails = {
          userId,
          email: res.user.email,
          token,
          banner,
          avatar,
          userType,
          termAndCondition,
          username: `${firstName} ${lastName}`,
        };
    
        // Store user details in AsyncStorage
        await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
    
        // Call login function from AuthContext
        login(token);
    
        // Set login response state
        setLoginResponse(userDetails);
    
        // Navigate to the Explore screen
        navigation.navigate("CodeOfConduct");
      } catch (error) {
        console.error("Error during Google Sign-In", error);
    
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert("Sign-In Cancelled", "Google Sign-In was cancelled.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              "Play Services Unavailable",
              "Google Play Services are required for this functionality."
            );
            break;
          default:
            Alert.alert(
              "Sign-In Error",
              "An error occurred during Google Sign-In."
            );
            console.error("Detailed error information:", error);
        }
      }
    };
    
    
    const handleTouchablePress = () => {
      Keyboard.dismiss();
    }; //to disable the keyboard
    const onSubmitHandler = async () => {
      if (
        !signUpData.firstName ||
        !signUpData.lastName ||
        !signUpData.email ||
        !signUpData.password
      ) {
        alert("Please fill in all required fields.");
        return;
      }
  
      try {
        const response = await apiPostMethod("users", signUpData);
        if (response.status === 200) {
          Alert.alert("Account Created Successfully. Please Verify your Email.");
          console.log(response.data);
          setSignUpData(response.data);
          navigation.navigate("Login");
        }
      } catch (error) {
        if (error.response) {
          Alert.alert(error.response.data.message);
          if (
            error.response.data.message ===
            `"data" is not allowed. "error" is not allowed. "message" is not allowed`
          )
            Alert.alert("This email id is already registered");
        } else {
          console.log("Network error:", error.message);
        }
      }
    };
    console.log(signUpData);
  
    const [fontsLoaded] = useFonts({
      "Modulus-pro": require("../assets/font/modulus-pro-3.ttf"),
    });
    if (!fontsLoaded) {
      return null;
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
        <TouchableWithoutFeedback onPress={handleTouchablePress}>
          <View style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ marginVertical: 22 }}>
              <Text
                style={{
                  fontFamily: "Modulus-pro",
                  fontSize: 36,
                  fontWeight: "600",
                  marginTop: 10,
                  color: COLORS.orange,
                }}
              >
                Welcome,
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "400",
                  color: COLORS.grey,
                }}
              >
                connect to the world & become
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "400",
                  color: COLORS.grey,
                  marginBottom: 20,
                }}
              >
                better.
              </Text>
            </View>
  
            <View
              style={{
                marginBottom: 12,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.inputFields1}>
                <TextInput
                  placeholder="First Name"
                  value={signUpData.firstName}
                  placeholderTextColor={COLORS.grey}
                  onChangeText={(text) =>
                    setSignUpData({ ...signUpData, firstName: text })
                  }
                  style={{
                    width: "100%",
                    color: COLORS.white,
                  }}
                />
              </View>
  
              <View style={styles.inputFields1}>
                <TextInput
                  placeholder="Last Name"
                  value={signUpData.lastName}
                  placeholderTextColor={COLORS.grey}
                  onChangeText={(text) =>
                    setSignUpData({ ...signUpData, lastName: text })
                  }
                  style={{
                    width: "100%",
  
                    color: COLORS.white,
                  }}
                />
              </View>
            </View>
  
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputFields2}>
                <TextInput
                  placeholder="Email"
                  value={signUpData.email}
                  placeholderTextColor={COLORS.grey}
                  onChangeText={(text) =>
                    setSignUpData({ ...signUpData, email: text })
                  }
                  keyboardType="email-address"
                  style={{
                    width: "100%",
                    color: COLORS.white,
                  }}
                />
              </View>
            </View>
  
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputFields2}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={COLORS.grey}
                  secureTextEntry={isPasswordShown}
                  value={signUpData.password}
                  onChangeText={(text) =>
                    setSignUpData({ ...signUpData, password: text })
                  }
                  style={{
                    width: "100%",
                    color: COLORS.white,
                  }}
                />
  
                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={styles.passwordEye}
                >
                  {isPasswordShown == true ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.grey} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.grey} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
  
            <View style={{ marginBottom: 12 }}>
              <View style={styles.inputFields2}>
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.grey}
                  secureTextEntry={isConfirmPasswordShown}
                  value={signUpData.confirmPassword}
                  onChangeText={(text) =>
                    setSignUpData({ ...signUpData, confirmPassword: text })
                  }
                  style={{
                    width: "100%",
                    color: COLORS.white,
                  }}
                />
  
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordShown(!isConfirmPasswordShown)
                  }
                  style={styles.passwordEye}
                >
                  {isConfirmPasswordShown == true ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.grey} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.grey} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
  
            <Button
              title="Create an account"
              filled
              style={styles.buttonStyle}
              onPress={onSubmitHandler}
            />
  
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <View style={styles.dividerLine} />
              <Text style={{ fontSize: 14, color: COLORS.grey }}> or </Text>
              <View style={styles.dividerLine} />
            </View>
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={signIn}
                style={styles.googleSignUpButton}
              >
                <Image
                  source={require("../assets/SignUp/google.png")}
                  style={styles.iconStyle}
                  resizeMode="contain"
                />
  
                <Text style={{ color: COLORS.white }}>Sign in using Google</Text>
              </TouchableOpacity>
  
              {/* <TouchableOpacity
                onPress={() => console.log("Pressed Apple")}
                style={styles.appleSignUpButton}
              >
                <Image
                  source={require("../assets/SignUp/apple.png")}
                  style={styles.iconStyle}
                  resizeMode="contain"
                />
  
                <Text style={{ color: COLORS.white }}>Sign in using Apple</Text>
              </TouchableOpacity> */}
            </View>
  
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ fontSize: 14, color: COLORS.grey, fontWeight: "400" }}
              >
                Already have an account?
              </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.white,
                    fontWeight: "600",
                    marginLeft: 6,
                  }}
                >
                  Log in
                </Text>
              </Pressable>
            </View>
  
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginVertical: 30,
              }}
            >
          <Pressable onPress={()=>{Linking.openURL("https://connectcamp.notion.site/Terms-Conditions-f8245245508d4dbda2ba963b04a4a014")}}>
          <Text style={styles.bottomTextStyle}>Terms & Conditions</Text>
              </Pressable>
              <Pressable onPress={()=>{Linking.openURL("https://connectcamp.notion.site/Privacy-Policy-e640f007a799482ab2860dea5be2ba40")}}>
                <Text style={styles.bottomTextStyle}>Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    inputFields1: {
      width: "49%",
      height: height * 0.05,
      borderColor: COLORS.grey,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 22,
    },
  
    inputFields2: {
      width: "100%",
      height: height * 0.05,
      borderColor: COLORS.grey,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 22,
    },
  
    passwordEye: {
      position: "absolute",
      right: 12,
    },
    buttonStyle: {
      marginTop: 18,
      marginBottom: 4,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: COLORS.grey,
      marginHorizontal: 10,
    },
    googleSignUpButton: {
      // flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: height * 0.05,
      borderWidth: 1,
      borderColor: COLORS.grey,
      marginBottom: 10,
      borderRadius: 10,
    },
    appleSignUpButton: {
      // flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: height * 0.05,
      borderWidth: 1,
      borderColor: COLORS.grey,
      borderRadius: 10,
    },
    iconStyle: {
      height: height * 0.05,
      width: width * 0.05,
      marginRight: 8,
    },
    bottomTextStyle: {
      fontSize: 14,
      color: COLORS.grey,
      fontWeight: "400",
      marginLeft: 6,
    },
  });
  
  export default Signup;
  