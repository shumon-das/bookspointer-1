import { useBookDetailsStore } from "@/app/store/bookDetailsStore";
import { useReviewStore } from "@/app/store/reviewStore";
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
      if (Object.keys(notificationData).includes("book_id") && Object.keys(notificationData).includes("review_id")) {
        useReviewStore.getState().setSelectedBook({id: notificationData.book_id})
        setTimeout(() => {
          router.push("/screens/book/single-book-reviews");
        }, 50);
      }
    }

    if (notificationData.type === NOTIFICATION_TYPE.CREATE_BOOK) {
      if (Object.keys(notificationData).includes("id") && Object.keys(notificationData).includes("title") && Object.keys(notificationData).includes("author")) {
        useBookDetailsStore.getState().setSelectedBook({
          id: notificationData.id,
          uuid: notificationData.uuid,
          title: notificationData.title,
          author: notificationData.author,
          url: notificationData.url,
          createdBy: notificationData.createdBy 
        });
        setTimeout(() => {
          router.push({
            pathname: "/screens/book/details",
            params: { id: notificationData.id, title: notificationData.title, author: notificationData.author.full_name },
          });
        }, 50);
      }
    }
      
  }

};