import React from "react";
import { ScrollView, View } from "react-native";
import HTMLView from "react-native-htmlview";


const HtmlContent = ({ content }: any) => {
  const cleanHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "<p></p>")
        .replace(/<img[^>]*>/g, '')
        .replace(new RegExp('<p>', 'g'), '<span>')
        .replace(new RegExp('</p>', 'g'), '</span>');
  }

  const styles = { span: { fontSize: 16 }, p: { fontSize: 16 }, br: { height: 0 } };
  
  return (
    <ScrollView style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 30 }}>
        <HTMLView
          value={cleanHtml(content)}
          stylesheet={{...styles}}
        />
    </ScrollView> 
  );
};

export default HtmlContent;
