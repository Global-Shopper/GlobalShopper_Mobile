import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";


// Add the public key generated from the console here.

const requestUserPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted" )
    } else {
        console.log("Notification permission denied")
    }
}

const getFCMToken = async () => {
    try {
        const messaging = getMessaging();
        const token = await getToken(messaging, {vapidKey: "BDCpfgiARHJpgy-IosIVr3tqH_LferFwwAq3GE17I7eF4QjgsZaLbihqo22SGXS8KSCgNuECGryGXvBiconn7a4"});
        console.log("Token," , token )
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