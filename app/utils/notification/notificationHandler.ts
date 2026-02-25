import { NOTIFICATION_TYPE } from "@/constants/NotificationType";
import { Router } from "expo-router";

export const handleNotificationNavigation = (data: any, router: Router) => {
  const notificationData = JSON.parse(data.data);
  // console.log(notificationData)
  if (!notificationData || !notificationData.type) return;

  if (Object.values(NOTIFICATION_TYPE).includes(notificationData.type)) {
    if ((notificationData.type === NOTIFICATION_TYPE.FOLLOW) || (notificationData.type === NOTIFICATION_TYPE.UNFOLLOW)) {
      if (notificationData.roles && notificationData.roles.includes("ROLE_AUTHOR")) {
        router.push({
          pathname: "/screens/author/author-profile",
          params: { uuid: notificationData.user_uuid },
        });
      }
      if (notificationData.roles && notificationData.roles.includes("ROLE_USER")) {
        router.push({
          pathname: "/screens/user/visit-user",
          params: { uuid: notificationData.user_uuid },
        });
      }
    }

    if (notificationData.type === NOTIFICATION_TYPE.REVIEW) {
      if (notificationData.roles && notificationData.roles.includes("ROLE_AUTHOR")) {
        router.push({
          pathname: "/screens/author/author-profile",
          params: { uuid: notificationData.uuid },
        });
      }
      if (notificationData.roles && notificationData.roles.includes("ROLE_USER")) {
        router.push({
          pathname: "/screens/user/visit-user",
          params: { uuid: notificationData.uuid },
        });
      }
    }
  }

};