import styled from '@emotion/styled';

export const PreviewContainerArticle = styled.article`
  height: 100%;
  outline: none;
  color: #333;
  font-family: system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.7;

  img {
    display: block;
    max-width: 100%;
  }

  hr {
    margin: 12px 0;
    color: #999;
  }

  .editor-ltr {
    text-align: left;
  }

  .editor-rtl {
    text-align: right;
  }

  .editor-paragraph {
    margin: 0;
  }

  .editor-quote {
    margin: 8px 0;
    padding-left: 15px;
    border-left: 5px solid #f0f0f0;
  }

  .editor-image {
    position: relative;
    display: inline-block;
  }

  .editor-h1,
  .editor-h2,
  .editor-h3 {
    margin: 8px 0;
    padding: 0;
    font-weight: bold;
  }

  .editor-h1 * {
    font-size: 16pt !important;
  }

  .editor-h2 * {
    font-size: 14pt !important;
  }

  .editor-h3 * {
    font-size: 13pt !important;
  }

  .editor-ol,
  .editor-ul {
    margin: 0;
    padding: 0;
  }

  .editor-ol {
    list-style-position: inside;
  }

  .editor-ol1 {
    list-style-type: decimal;
  }

  .editor-ol2 {
    list-style-type: lower-alpha;
  }

  .editor-ol3 {
    list-style-type: lower-roman;
  }

  .editor-ul {
    list-style-type: none;
  }

  .editor-ul .editor-li::before {
    display: inline-block;
    width: 0.25em;
    height: 0.25em;
    margin: 0 0.375em;
    vertical-align: middle;
    background-color: currentColor;
    border-radius: 50px;
    content: '';
  }

  .editor-li.editor-li-nested {
    margin-left: 20px;
    list-style-type: none;
  }

  .editor-li.editor-li-nested:after,
  .editor-li.editor-li-nested:before {
    display: none;
  }

  .editor-text-bold {
    font-weight: bold;
  }

  .editor-text-italic {
    font-style: italic;
  }

  .editor-text-underline {
    text-decoration: underline;
  }

  .editor-text-strikethrough {
    text-decoration: line-through;
  }

  .editor-text-underline-strikethrough {
    text-decoration: underline line-through;
  }

  .editor-text-code {
    padding: 2px 4px;
    font-size: 85%;
    font-family: 'SF Mono', 'Source Code Pro', Consolas, monospace;
    background-color: #f0f0f0;
  }
`;

export const PreviewContainer = styled.div`
  height: 100%;
  outline: none;
  color: #333;
  font-family: system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.7;

  img {
    display: block;
    max-width: 100%;
  }

  hr {
    margin: 12px 0;
    color: #999;
  }

  .editor-ltr {
    text-align: left;
  }

  .editor-rtl {
    text-align: right;
  }

  .editor-paragraph {
    margin: 0;
  }

  .editor-quote {
    margin: 8px 0;
    padding-left: 15px;
    border-left: 5px solid #f0f0f0;
  }

  .editor-image {
    position: relative;
    display: inline-block;
  }

  .editor-h1,
  .editor-h2,
  .editor-h3 {
    margin: 8px 0;
    padding: 0;
    font-weight: bold;
  }

  .editor-h1 * {
    font-size: 16pt !important;
  }

  .editor-h2 * {
    font-size: 14pt !important;
  }

  .editor-h3 * {
    font-size: 13pt !important;
  }

  .editor-ol,
  .editor-ul {
    margin: 0;
    padding: 0;
  }

  .editor-ol {
    list-style-position: inside;
  }

  .editor-ol1 {
    list-style-type: decimal;
  }

  .editor-ol2 {
    list-style-type: lower-alpha;
  }

  .editor-ol3 {
    list-style-type: lower-roman;
  }

  .editor-ul {
    list-style-type: none;
  }

  .editor-ul .editor-li::before {
    display: inline-block;
    width: 0.25em;
    height: 0.25em;
    margin: 0 0.375em;
    vertical-align: middle;
    background-color: currentColor;
    border-radius: 50px;
    content: '';
  }

  .editor-li.editor-li-nested {
    margin-left: 20px;
    list-style-type: none;
  }

  .editor-li.editor-li-nested:after,
  .editor-li.editor-li-nested:before {
    display: none;
  }

  .editor-text-bold {
    font-weight: bold;
  }

  .editor-text-italic {
    font-style: italic;
  }

  .editor-text-underline {
    text-decoration: underline;
  }

  .editor-text-strikethrough {
    text-decoration: line-through;
  }

  .editor-text-underline-strikethrough {
    text-decoration: underline line-through;
  }

  .editor-text-code {
    padding: 2px 4px;
    font-size: 85%;
    font-family: 'SF Mono', 'Source Code Pro', Consolas, monospace;
    background-color: #f0f0f0;
  }
`;
