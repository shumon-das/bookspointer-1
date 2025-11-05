import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { toPellHtml, toQuillHtml } from '../../app/utils/htmlNormalizer'
import { labels } from '@/app/utils/labels';

export default function TextEditor({initialContent, onChange}: any) {
  const richText = useRef<RichEditor | null>(null);
  const [html, setHtml] = React.useState(toPellHtml(initialContent) || '');
  const onEditorChange = (newHtml: any) => {
    setHtml(newHtml);
    if (html !== '') onChange(toQuillHtml(html))
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
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
        />
        <RichEditor
            ref={richText}
            initialContentHTML={initialContent}
            onChange={onEditorChange}
            placeholder={labels.startWriting}
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}
        />
    </View>
  );
}
