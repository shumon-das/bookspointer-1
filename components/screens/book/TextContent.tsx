import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

// Define custom styles for your tags here
const tagsStyles = {
  body: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'AdorshoLipi', // AdorshoLipi, Nikosh, Kalpurush, Siyam Rupali, SolaimanLipi
  },
  img: {
    marginVertical: 10,
    borderRadius: 8,
  },
  p: {
    marginBottom: 20,   // 👈 controls paragraph spacing
    lineHeight: 20,     // 👈 controls text height
  },
};

const TextContent = ({ content, isDetailsScreen=false, fontSize=16, textColor='#333', backgroundColor='#fff' }: any) => {
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
      defaultTextProps={{ 
        selectable: true,
        selectionColor: 'lightblue' 
      }}
    />
  );
};

export default TextContent;
