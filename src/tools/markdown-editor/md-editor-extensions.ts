import { config } from 'md-editor-v3';
import hljs from 'highlight.js/lib/common';
import katex from 'katex';
import mermaid from 'mermaid';
import * as echarts from 'echarts';
import * as prettier from 'prettier/standalone';
import * as prettierMarkdown from 'prettier/plugins/markdown';
import Cropper from 'cropperjs';
import screenfull from 'screenfull';

import 'cropperjs/dist/cropper.css';

// md-editor-v3 injects <script>/<link> tags from unpkg.com for every editor extension it
// has no instance for. Hand it bundled instances instead, so the editor works offline and
// never contacts a CDN. This module is only imported by the lazily loaded tool component,
// and evaluating it (before the component renders) is what makes the instances available.
//
// With an instance set, md-editor-v3 also skips the matching stylesheets: katex.css is
// already loaded globally (src/main.ts), the cropper styles are imported above and the
// highlight.js theme is provided by markdown-editor.vue.
config({
  editorExtensions: {
    highlight: { instance: hljs },
    prettier: { prettierInstance: prettier, parserMarkdownInstance: prettierMarkdown },
    cropper: { instance: Cropper },
    screenfull: { instance: screenfull },
    mermaid: { instance: mermaid },
    katex: { instance: katex },
    echarts: { instance: echarts },
  },
});
