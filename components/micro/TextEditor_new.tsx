import React from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function TextEditor({
  initialContent,
  onChange,
}: {
  initialContent: string;
  onChange: (html: string) => void;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body {
    margin: 0;
    padding: 10px;
    font-family: sans-serif;
  }
  .toolbar {
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
  .toolbar button {
    margin-right: 8px;
    font-size: 16px;
  }
  #editor {
    min-height: 300px;
    outline: none;
  }
  img {
    max-width: 100%;
    margin: 6px 0;
  }
</style>
</head>
<body>

<div class="toolbar">
  <button onclick="cmd('bold')"><b>B</b></button>
  <button onclick="cmd('italic')"><i>I</i></button>
  <button onclick="pickImage()">📷</button>
</div>

<div id="editor" contenteditable="true">${initialContent || ''}</div>

<input type="file" id="imageInput" accept="image/*" style="display:none" />

<script>
  function cmd(command) {
    document.execCommand(command, false, null);
    send();
  }

  function send() {
    window.ReactNativeWebView.postMessage(
      document.getElementById('editor').innerHTML
    );
  }

  function pickImage() {
    document.getElementById('imageInput').click();
  }

  document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
      const img = document.createElement('img');
      img.src = reader.result;
      document.getElementById('editor').appendChild(img);
      send();
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('editor').addEventListener('input', send);
</script>

</body>
</html>
`;

  return (
    <View style={{ flex: 1, height: SCREEN_HEIGHT - 150 }}>
      <WebView
        source={{ html, baseUrl: 'https://localhost' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(e) => onChange(e.nativeEvent.data)}
      />
    </View>
  );
}
