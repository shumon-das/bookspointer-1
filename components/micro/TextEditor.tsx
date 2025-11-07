import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { toPellHtml, toQuillHtml } from '../../app/utils/htmlNormalizer'
import { labels } from '@/app/utils/labels';
import { useFocusEffect } from '@react-navigation/native';

export default function TextEditor({initialContent, onChange}: any) {
  const richText = useRef<RichEditor | null>(null);
  const [html, setHtml] = React.useState(toPellHtml(initialContent) || '');

  useFocusEffect(
    React.useCallback(() => {
      if (initialContent) {
        const newHtml = toPellHtml(initialContent) || '';
        setHtml(newHtml);
        richText.current?.setContentHTML(newHtml);
      }
    }, [initialContent])
  );

  useEffect(() => {
    const newHtml = toPellHtml(initialContent) || '';
    setHtml(newHtml);
    if (richText.current) {
      richText.current.setContentHTML(newHtml);
    }
  }, [initialContent]);

  const onEditorChange = (newHtml: any) => {
    setHtml(newHtml);
    if (html !== '') onChange(toQuillHtml(html))
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#fff' }}>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.heading1,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.undo,
            actions.redo,
            actions.insertImage,
            actions.setTextColor
          ]}
          style={{ backgroundColor: '##fff' }}
        />
        <RichEditor
            ref={richText}
            initialContentHTML={initialContent}
            onChange={onEditorChange}
            placeholder={labels.startWriting}
            scrollEnabled={true}
            editorStyle={{
              contentCSSText: 'min-height:400px; max-height:400px; overflow-y:auto;border-bottom:1px solid #ccc;',
            }}
        />
    </View>
  );
}
