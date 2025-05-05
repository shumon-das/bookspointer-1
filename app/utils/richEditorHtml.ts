// EditorHtml.ts
export const htmlString = (initialContent: string): string => { 
  return `
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
            overflow: hidden;
          }
          #editor-container {
            height: 100%;
            max-height: 100%;
            overflow-y: auto;
          }
          .ql-toolbar {
            position: sticky;
            top: 0;
            background: white;
            z-index: 999;
          }
          #editor-container > p:first-child {
            overflow-y: scroll;
          }  
        </style>
      </head>
      <body>
        <div id="toolbar">
          <!-- Custom toolbar to avoid Quill's default issue -->
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-align" value="center"></button>
            <button class="ql-align" value="right"></button>
            <button class="ql-align" value="justify"></button>
            <button class="ql-link"></button>
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
          </span>
        </div>
        <div id="editor-container">${initialContent}</div>

        <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            const quill = new Quill('#editor-container', {
              theme: 'snow',
              modules: {
                toolbar: '#toolbar'
              },
              placeholder: 'Write something...',
            });

            // quill.on('text-change', function (e) {
            //   setTimeout(() => {
            //    const html = quill.root.innerHTML;
            //    window.ReactNativeWebView?.postMessage(html);
            //   }, 10000);
            // });

            window.getHTML = function () {
              const html = quill.root.innerHTML;
              window.ReactNativeWebView?.postMessage(html);
            }

            // Prevent toolbar buttons from stealing focus
            document.querySelector('#toolbar').addEventListener('mousedown', function(e) {
              e.preventDefault();
            });
          });
        </script>
      </body>
    </html>
  `;
}