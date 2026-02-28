import React from 'react';
import { Linking, useWindowDimensions } from 'react-native';
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
              Linking.openURL(href);
            }
          },
        },
      }}
    />
  );
};

export default TextContent;
