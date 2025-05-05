import React from "react";
import { ScrollView, View } from "react-native";
import HTMLView from "react-native-htmlview";


const HtmlContent = ({ content }: any) => {
  const cleanHtml = (html: string) => html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "");
  
  return (
    <ScrollView>
        <HTMLView
          value={cleanHtml(content)}
          stylesheet={{ p: { fontSize: 16 }, br: { height: 0 } }}
        />
    </ScrollView>
  );
};

export default HtmlContent;
