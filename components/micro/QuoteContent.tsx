import React from "react";
import { ScrollView, View } from "react-native";
import HTMLView from "react-native-htmlview";


const QuoteContent = ({ content }: any) => {
  const cleanHtml = (html: string) => html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "<p></p>")
                                          .replace(new RegExp('<p>', 'g'), '<span>')
                                          .replace(new RegExp('</p>', 'g'), '</span>');
  
  return (
    <ScrollView style={{ paddingHorizontal: 10, paddingTop: 5, paddingBottom: 30 }}>
        <HTMLView
          value={cleanHtml(content)}
          stylesheet={{ span: { fontSize: 20 }, p: { fontSize: 20 }, br: { height: 0 } }}
        />
    </ScrollView>
  );
};

export default QuoteContent;
