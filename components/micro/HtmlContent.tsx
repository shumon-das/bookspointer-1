import React, { useEffect, useRef } from "react";
import { ScrollView, View, Image } from "react-native";
import HTMLView from "react-native-htmlview";
import DetailsScreenBottomAds from "./meta/DetailsScreenBottomAds";


const HtmlContent = ({ content, isDetailsScreen=false }: any) => {
  const cleanHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "<p></p>")
        .replace(new RegExp('<p>', 'g'), '<span>')
        .replace(new RegExp('</p>', 'g'), '</span>');
  }

  const styles = { span: { fontSize: 16 }, p: { fontSize: 16 }, br: { height: 0 } };
  const scrollRef = useRef(null);
  useEffect(() => {
    // @ts-ignore
    if (content) scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [content])
  
  return (
    <ScrollView ref={scrollRef} style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 30 }}>
        <HTMLView
          value={cleanHtml(content)}
          stylesheet={{...styles}}
          renderNode={(node, index, siblings, parent, defaultRenderer) => {
            if (node.name === 'img') {
              const src = node.attribs.src;
              return (
                <Image
                  key={index}
                  source={{ uri: src }}
                  style={{ width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 }}
                />
              );
            }
          }}
        />
        {isDetailsScreen && <DetailsScreenBottomAds />}
        {isDetailsScreen && <View style={{height: 50}}></View>}
    </ScrollView> 
  );
};

export default HtmlContent;
