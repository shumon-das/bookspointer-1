import AsyncStorage from "@react-native-async-storage/async-storage";
import labels from "./labels";

export const category = async (book: any) => {
  const userLang = await AsyncStorage.getItem('user-lang');
  if (typeof book.category === 'string') {
    return Object.keys(book).includes('categoryData') && userLang === 'en'
      ? book.categoryData?.name.replace('-', ' ') 
      : book.category;
  }
  if (userLang === 'en') {
    return typeof book.category === 'string' ? book.category : book.category.name.replace('-', ' ');
  }
  return typeof book.category === 'string' ? book.category : book.category.label;
}

export const popoverAction = (item: any, loggedInUser: any, book: any, router: any) => {
    if ('edit' === item.name) {
      if (loggedInUser && loggedInUser.uuid === book.createdBy.uuid) {
        router.push({ pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, id: book.id } })
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }

    if ('report' === item.name) {
      if (loggedInUser) {
        router.push({ pathname: "/screens/report/report-post", params: { targetPost: book.id, targetUser: book.createdBy.id, title: book.title } });
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }

    if ('block' === item.name) {
      if (loggedInUser) {
        router.push({ pathname: "/screens/block/block-user", params: { id: book.createdBy.id, username: book.createdBy.fullName, } });
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }
  }