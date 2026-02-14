// import { getLastVersionDetails } from "@/services/versionApi";
// import { run, getOne } from "../database/db";
// import { Alert } from "react-native"
// import * as Linking from 'expo-linking';

// interface LastVersionInterface {
//     newVersion: string;
//     alertLabel: string;
//     alertMessage: string;
//     playstoreUrl: string;
// }

export const isAppUpdateExists = async (currentAppVersion: string) => {
    // const version = await getVersionDetails(currentAppVersion)
    // if (version && null === checkVersionDate(getTodayDate(), version.version_check_date)) {
    //     // console.log('version checked...')
    //     return
    // }
    // if (version && version.app_version !== version.new_version) {
    //     Alert.alert(version.alertLabel, version.alertMessage, [
    //         { text: "Cancel", onPress: () => console.log("Cancelled"), style: "cancel" },
    //         { text: "Update", onPress: () => handleAppUpdate(version.playstoreUrl) }
    //     ])
    //     return
    // }

    // const lastVersion = await getLastVersionDetails() as LastVersionInterface;
    // if (lastVersion && checkVersionDate(currentAppVersion, lastVersion.newVersion)) {
    //     // Alert.alert('New Version Available', 'Books Pointer new version is more attractive and easy to use. please update your app', [
    //     Alert.alert(lastVersion.alertLabel, lastVersion.alertMessage, [
    //         { text: "Cancel", onPress: () => console.log("Cancelled"), style: "cancel" },
    //         { text: "Update", onPress: () => handleAppUpdate(lastVersion.playstoreUrl) }
    //     ])
    //     return
    // }
}

// const handleAppUpdate = async (playstoreUrl: string) => {
//     try {
//         await Linking.openURL(playstoreUrl);
//     } catch(e) {
//       alert(e);
//       console.log('Something went wrong. ', e)
//     }
//  };

//  const checkVersionDate = (currentVersion: string, lastVersion: string) => {
//     // const dateString = '13_12_2025'; 
//     const [lday, lmonth, lyear] = lastVersion.split('_').map(Number);
//     const LastVersionDate = new Date(lyear, lmonth - 1, lday);

//     const [cday, cmonth, cyear] = currentVersion.split('_').map(Number);
//     const currentVersionDate = new Date(cyear, cmonth - 1, cday);

//     // 3. Perform the comparison
//     if (LastVersionDate.getTime() > currentVersionDate.getTime()) {
//         // console.log("Last Version Date is GREATER than the App Version.");
//         return true;
//     } else if (LastVersionDate.getTime() < currentVersionDate.getTime()) {
//         // console.log("Last Version date is LOWER (earlier) than the App Version.");
//         return false;
//     } else {
//         // console.log("Last Version is the exact same App Version.");
//         return null;
//     }
//  }

//  const getTodayDate = () => {
//     return new Date().toISOString().slice(0, 10);
//  }

//  const getVersionDetails = async (currentAppVersion: string) => {
//     try {
//         const row = await getOne(`SELECT * FROM appversion WHERE app_version = ?`, [currentAppVersion]) as any;
//         if (!row) {
//             const lastVersion = await getLastVersionDetails() as LastVersionInterface;
//             if (lastVersion) {
//                 const today = getTodayDate()
//                 const newVersion = lastVersion.newVersion
//                 const newVersionAlertLabel = lastVersion.alertLabel
//                 const newVersionAlertMessage = lastVersion.alertMessage
//                 const newVersionPlayStoreUrl = lastVersion.playstoreUrl
//                 await run(
//                     `INSERT INTO appversion (
//                         app_version,
//                         version_check_date,
//                         new_version,
//                         new_version_alert_label_message,
//                         new_version_alert_body_message,
//                         playstore_url,
//                         timestamp
//                     )
//                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
//                     [
//                         currentAppVersion,
//                         today,
//                         newVersion,
//                         newVersionAlertLabel,
//                         newVersionAlertMessage,
//                         newVersionPlayStoreUrl,
//                         Date.now()
//                     ]
//                 );

//                 const row = await getOne(`SELECT * FROM appversion WHERE app_version = ?`, [currentAppVersion]) as any;

//                 return row;
//             } else {
//                 console.log('lastVersion not found by api. version details save into sqllite failed')
//                 return null;
//             }
//         }

//         return row;
//     } catch (e) {
//         console.log('getVersionDetails failed ', e)
//         return null;
//     }
//  }
 