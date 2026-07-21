import labels from "./labels";

export const category = (book: any, lang: string = "bn"): string => {
  const categoryKey = lang === "bn" || lang === "bangla" ? "label" : "name";
  const value = book?.category;
  const categoryData = book?.categoryData;

  // Category-books may return category as a string while localized values
  // are available in categoryData.
  if (categoryData && typeof categoryData === "object") {
    return categoryData[categoryKey] ?? categoryData.name ?? categoryData.label ?? "";
  }
  if (value && typeof value === "object") {
    return value[categoryKey] ?? value.name ?? value.label ?? "";
  }
  if (typeof value === "string") return value;
  return "";
};

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