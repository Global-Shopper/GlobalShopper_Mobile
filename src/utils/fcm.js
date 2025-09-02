import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { setFcmToken } from "../features/app";
import { store } from "../redux/store";


// Add the public key generated from the console here.

const requestUserPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted" )
    } else {
        console.log("Notification permission denied")
    }
}

const keyPair = process.env.EXPO_PUBLIC_KEY_PAIR

const getFCMToken = async () => {
    try {
        const messaging = getMessaging();
        const token = await getToken(messaging, {vapidKey: keyPair});
        console.log("Token," , token )
        store.dispatch(setFcmToken(token))
        return token
    } catch (error) {
        console.log("fail to get token", error)
    }
}

export const useNotification = () => {
    useEffect(()=>{
        console.log("useNotification")
        requestUserPermission()
        getFCMToken()
    },[])
}