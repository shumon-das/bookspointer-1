import { Router } from "expo-router";

export const handleNotificationNavigation = (data: any, router: Router) => {
  if (!data) return;

  if (data.screenname === "notifications") {
    router.push("/screens/notifications");
    return;
  }

  if (data.screenname === "book") {
    router.push({
      pathname: "/screens/book/details",
      params: { data: JSON.stringify(data) },
    });
    return;
  }

  if (data.absolutePath) {
    router.push({
      pathname: data.absolutePath.pathname,
      params: {
        [data.absolutePath.key]: JSON.stringify(data.absolutePath.value),
      },
    });
  }
};