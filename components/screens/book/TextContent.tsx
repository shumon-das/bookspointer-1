import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import API_CONFIG from '@/app/utils/config';
import { useBookDetailsStore } from '@/app/store/bookDetailsStore';
import RenderHtml from 'react-native-render-html';

const tagsStyles = {
  body: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    fontFamily: 'System',
  },
  img: {
    marginVertical: 10,
    borderRadius: 8,
  },
  p: {
    marginBottom: 8,
    lineHeight: 20,
  },
  a: {
    color: '#1e90ff',
    textDecorationLine: 'underline' as const,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  ul: {
    marginVertical: 10,
  },
  li: {
    marginBottom: 6,
  },
} as const;

const TextContent = ({ content, isDetailsScreen=false, fontSize=16, textColor='black', backgroundColor='#fff' }: any) => {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const openLink = async (href: string) => {
    try {
      const parsed = new URL(href, API_CONFIG.BASE_URL);
      const isBookPointer = parsed.hostname === 'bookspointer.com' || parsed.hostname === 'www.bookspointer.com' || parsed.hostname === 'api.bookspointer.com';
      const path = parsed.pathname;
      const isBookPath = path.length > 1 && !path.startsWith('/user/') && !path.startsWith('/author/') && !path.startsWith('/history/');

      if (isBookPointer && isBookPath) {
        const response = await fetch(API_CONFIG.BASE_URL + '/book' + path);
        if (!response.ok) throw new Error('Book not found');
        const book = await response.json();
        if (!book?.id) throw new Error('Invalid book response');
        useBookDetailsStore.getState().setSelectedBook(book);
        router.push({
          pathname: '/screens/book/details',
          params: {
            id: String(book.id),
            title: book.title || '',
            author: typeof book.author === 'string' ? book.author : book.author?.fullName || '',
            isQuote: 'no',
          },
        });
        return;
      }
    } catch (error) {
      console.warn('Could not open BookPointer link in app:', error);
    }

    router.push({ pathname: '/screens/in-app-browser' as any, params: { url: href } });
  };
  const styles = {
    ...tagsStyles,
    body: {
      ...tagsStyles.body,
      fontSize: fontSize,
      color: textColor,
      backgroundColor: backgroundColor,
    },
  };

  const cleanHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "<p></p>")
               .replace(/<p class="ql-align-justify"><br><\/p>/g, "")
  }

  return (
    <RenderHtml
      contentWidth={width}
      source={{ html: cleanHtml(content) }}
      tagsStyles={styles}
      ignoredDomTags={['iframe']}
      // This enables text selection across the entire document
      enableExperimentalMarginCollapsing={true}
      enableExperimentalBRCollapsing
      defaultTextProps={{ 
        selectable: true,
        selectionColor: 'lightblue' 
      }}
      renderersProps={{
        a: {
          onPress: (_, href) => {
            if (href) {
              openLink(href);
            }
          },
        },
      }}
    />
  );
};

export default TextContent;
