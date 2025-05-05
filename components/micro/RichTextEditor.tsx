import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  onChange?: (html: string) => void;
  style?: object;
  initialContent: string;
};

const RichTextEditor: React.FC<Props> = ({ onChange, style }) => {
  const webviewRef = useRef(null);

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Quill Editor</title>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
      <style>
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #fff;
        }
        #editor-container {
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="editor-container"></div>
      <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
      <script>
        document.addEventListener("DOMContentLoaded", function () {
          const quill = new Quill('#editor-container', {
            theme: 'snow',
            placeholder: 'Write something...',
          });

          quill.on('text-change', function () {
            const html = quill.root.innerHTML;
            window.ReactNativeWebView?.postMessage(html);
          });
        });
      </script>
    </body>
  </html>
  `;

  const handleMessage = (event: any) => {
    const content = event.nativeEvent.data;
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 300 }, // Default height
  webview: { flex: 1 },
});

export default RichTextEditor;
