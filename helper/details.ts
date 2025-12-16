import { singleBook } from "@/services/api";

export const fetchNextPrevPageTexts = async (bookId: number, pageNumber: number) => {
    let prev = null
    if (pageNumber > 1) {
        prev = await singleBook({id: bookId, page: pageNumber - 1})
    }
    const next = await singleBook({id: bookId, page: pageNumber + 1})

    return {
        prevPageTexts: prev ? prev.text : '',
        nextPageTexts: next.text 
    }
}


export default { fetchNextPrevPageTexts }