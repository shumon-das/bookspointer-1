import { Parser } from 'htmlparser2';

export const htmlToPlainTexts = (htmlContent: string): string => {
  let text = '';

  const parser = new Parser({
    ontext(data) {
      text += data;
    }
  }, { decodeEntities: true });

  parser.write(htmlContent);
  parser.end();

  return text.trim();
}

// Example usage
// const html = `<p><strong>Hello</strong> <em>World</em>! <img src="img.jpg"/> <video src="v.mp4"></video></p>`;
// const result = extractPlainText(html);
// console.log(result); // Hello World!
