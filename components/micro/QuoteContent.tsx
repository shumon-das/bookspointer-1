import React from "react";
import { ScrollView, Text } from "react-native";


const QuoteContent = ({ content }: any) => {
  const text = String(content || "")
    .replace(/<br\s*\/?>(?:\s*)/gi, "\n")
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\n[ \t]+/g, "\n")
    .trim();

  return (
    <ScrollView style={{ paddingHorizontal: 10, paddingTop: 5, paddingBottom: 30 }}>
      <Text style={{ fontSize: 20, lineHeight: 28, fontStyle: "italic" }}>{text}</Text>
    </ScrollView>
  );
};

export default QuoteContent;
