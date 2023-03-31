import Header from "@editorjs/header";
import Link from "@editorjs/link";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import Tooltip from "editorjs-tooltip";

export const BLOCK_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: 'test',
    }
  },
  link: Link,
  checklist: Checklist,
  list: List,
  quote: Quote,
  code: Code,
  image: SimpleImage,
  Marker: {
    class: Marker,
    shortcut: "SHIFT+CMD+M",
  },
  tooltip: {
    class: Tooltip,
    config: {
      location: "left",
      highlightColor: "#FFEFD5",
      underline: true,
      backgroundColor: "#154360",
      textColor: "#FDFEFE",
    },
  },
};

export const DEFAULT_INITIAL_DATA = () => {
  return {
    time: new Date().getTime(),
    blocks: [
      {
        type: "header",
        data: {
          text: "This is my awesome editor!",
          level: 1,
        },
      },
    ],
  };
};

export const COVER_IMAGE_URLS = [
  "#FFFFFF",
  "#EAE4E9",
  "#FFF1E6",
  "#FDE2E4",
  "#FAD2E1",
  "#E2ECE9",
  "#BEE1E6",
  "#F0EFEB",
  "#DFE7FD",
  "#CDDAFD",
];

export const TAG_COLORS = [
  "#FFFFFF",
  "#EAE4E9",
  "#FFF1E6",
  "#FDE2E4",
  "#FAD2E1",
  "#E2ECE9",
  "#BEE1E6",
  "#F0EFEB",
  "#DFE7FD",
  "#CDDAFD",
];

export const DEFAULT_OBJECT_CONFIG = [
  {
    name: "color",
    value: "#FFFFFF",
  },
  {
    name: "font",
    value: "",
  },
  {
    name: "align",
    value: "center",
  },
  {
    name: "showTags",
    value: true,
  },
  {
    name: "showProps",
    value: true,
  },
  {
    name: "customCSS",
    value: "",
  },
];