import React from "react";
import { ScrollView, View } from "react-native";
import HTMLView from "react-native-htmlview";


const HtmlContent = ({ content }: any) => {
  const cleanHtml = (html: string) => html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "<p></p>")
                                          .replace(new RegExp('<p>', 'g'), '<span>')
                                          .replace(new RegExp('</p>', 'g'), '</span>');
  
  return (
    <ScrollView style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 30 }}>
        <HTMLView
          value={cleanHtml(content)}
          stylesheet={{ span: { fontSize: 16 }, p: { fontSize: 20 }, br: { height: 0 } }}
        />
    </ScrollView>
  );
};

export default HtmlContent;
