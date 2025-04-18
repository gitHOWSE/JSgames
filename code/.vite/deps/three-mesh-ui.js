import {
  BufferAttribute as BufferAttribute2,
  BufferGeometry,
  CanvasTexture,
  Color,
  FileLoader,
  LinearFilter,
  Mesh,
  Object3D,
  Plane,
  PlaneGeometry,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3 as Vector32
} from "./chunk-BJJYAW3L.js";
import {
  __publicField
} from "./chunk-JVWSFFO4.js";

// ../node_modules/three-mesh-ui/build/three-mesh-ui.module.js
var __webpack_require__ = {};
(() => {
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };
})();
(() => {
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
})();
(() => {
  __webpack_require__.r = (exports) => {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };
})();
var __webpack_exports__ = {};
__webpack_require__.d(__webpack_exports__, {
  "g1": () => (
    /* reexport */
    AlignItems_namespaceObject
  ),
  "gO": () => (
    /* reexport */
    Block
  ),
  "km": () => (
    /* reexport */
    ContentDirection_namespaceObject
  ),
  "zV": () => (
    /* reexport */
    core_FontLibrary
  ),
  "ol": () => (
    /* reexport */
    InlineBlock
  ),
  "uM": () => (
    /* reexport */
    JustifyContent_namespaceObject
  ),
  "N1": () => (
    /* reexport */
    Keyboard
  ),
  "xv": () => (
    /* reexport */
    Text
  ),
  "PH": () => (
    /* reexport */
    TextAlign_namespaceObject
  ),
  "UH": () => (
    /* reexport */
    Whitespace_namespaceObject
  ),
  "ZP": () => (
    /* binding */
    three_mesh_ui
  ),
  "Vx": () => (
    /* binding */
    update
  )
});
var ContentDirection_namespaceObject = {};
__webpack_require__.r(ContentDirection_namespaceObject);
__webpack_require__.d(ContentDirection_namespaceObject, {
  "COLUMN": () => COLUMN,
  "COLUMN_REVERSE": () => COLUMN_REVERSE,
  "ROW": () => ROW,
  "ROW_REVERSE": () => ROW_REVERSE,
  "contentDirection": () => contentDirection
});
var AlignItems_namespaceObject = {};
__webpack_require__.r(AlignItems_namespaceObject);
__webpack_require__.d(AlignItems_namespaceObject, {
  "CENTER": () => CENTER,
  "END": () => END,
  "START": () => START,
  "STRETCH": () => STRETCH,
  "alignItems": () => alignItems,
  "warnAboutDeprecatedAlignItems": () => warnAboutDeprecatedAlignItems
});
var JustifyContent_namespaceObject = {};
__webpack_require__.r(JustifyContent_namespaceObject);
__webpack_require__.d(JustifyContent_namespaceObject, {
  "CENTER": () => JustifyContent_CENTER,
  "END": () => JustifyContent_END,
  "SPACE_AROUND": () => SPACE_AROUND,
  "SPACE_BETWEEN": () => SPACE_BETWEEN,
  "SPACE_EVENLY": () => SPACE_EVENLY,
  "START": () => JustifyContent_START,
  "justifyContent": () => justifyContent
});
var Whitespace_namespaceObject = {};
__webpack_require__.r(Whitespace_namespaceObject);
__webpack_require__.d(Whitespace_namespaceObject, {
  "NORMAL": () => NORMAL,
  "NOWRAP": () => NOWRAP,
  "PRE": () => PRE,
  "PRE_LINE": () => PRE_LINE,
  "PRE_WRAP": () => PRE_WRAP,
  "WHITE_CHARS": () => WHITE_CHARS,
  "collapseWhitespaceOnInlines": () => collapseWhitespaceOnInlines,
  "collapseWhitespaceOnString": () => collapseWhitespaceOnString,
  "newlineBreakability": () => newlineBreakability,
  "shouldBreak": () => Whitespace_shouldBreak
});
var TextAlign_namespaceObject = {};
__webpack_require__.r(TextAlign_namespaceObject);
__webpack_require__.d(TextAlign_namespaceObject, {
  "CENTER": () => TextAlign_CENTER,
  "JUSTIFY": () => JUSTIFY,
  "JUSTIFY_CENTER": () => JUSTIFY_CENTER,
  "JUSTIFY_LEFT": () => JUSTIFY_LEFT,
  "JUSTIFY_RIGHT": () => JUSTIFY_RIGHT,
  "LEFT": () => LEFT,
  "RIGHT": () => RIGHT,
  "textAlign": () => textAlign
});
var x = (y) => {
  var x2 = {};
  __webpack_require__.d(x2, y);
  return x2;
};
var external_three_namespaceObject = x({ ["BufferAttribute"]: () => BufferAttribute2, ["BufferGeometry"]: () => BufferGeometry, ["CanvasTexture"]: () => CanvasTexture, ["Color"]: () => Color, ["FileLoader"]: () => FileLoader, ["LinearFilter"]: () => LinearFilter, ["Mesh"]: () => Mesh, ["Object3D"]: () => Object3D, ["Plane"]: () => Plane, ["PlaneGeometry"]: () => PlaneGeometry, ["ShaderMaterial"]: () => ShaderMaterial, ["TextureLoader"]: () => TextureLoader, ["Vector2"]: () => Vector2, ["Vector3"]: () => Vector32 });
var ROW = "row";
var ROW_REVERSE = "row-reverse";
var COLUMN = "column";
var COLUMN_REVERSE = "column-reverse";
function contentDirection(container, DIRECTION, startPos, REVERSE) {
  let accu = startPos;
  let childGetSize = "getWidth";
  let axisPrimary = "x";
  let axisSecondary = "y";
  if (DIRECTION.indexOf(COLUMN) === 0) {
    childGetSize = "getHeight";
    axisPrimary = "y";
    axisSecondary = "x";
  }
  for (let i = 0; i < container.childrenBoxes.length; i++) {
    const child = container.childrenBoxes[i];
    const CHILD_ID = child.id;
    const CHILD_SIZE = child[childGetSize]();
    const CHILD_MARGIN = child.margin || 0;
    accu += CHILD_MARGIN * REVERSE;
    container.childrenPos[CHILD_ID] = {
      [axisPrimary]: accu + CHILD_SIZE / 2 * REVERSE,
      [axisSecondary]: 0
    };
    accu += REVERSE * (CHILD_SIZE + CHILD_MARGIN);
  }
}
var START = "start";
var CENTER = "center";
var END = "end";
var STRETCH = "stretch";
function alignItems(boxComponent, DIRECTION) {
  const ALIGNMENT = boxComponent.getAlignItems();
  if (AVAILABLE_ALIGN_ITEMS.indexOf(ALIGNMENT) === -1) {
    console.warn(`alignItems === '${ALIGNMENT}' is not supported`);
  }
  let getSizeMethod = "getWidth";
  let axis = "x";
  if (DIRECTION.indexOf(ROW) === 0) {
    getSizeMethod = "getHeight";
    axis = "y";
  }
  const AXIS_TARGET = boxComponent[getSizeMethod]() / 2 - (boxComponent.padding || 0);
  boxComponent.childrenBoxes.forEach((child) => {
    let offset;
    switch (ALIGNMENT) {
      case END:
      case "right":
      // @TODO : Deprecated and will be remove upon 7.x.x
      case "bottom":
        if (DIRECTION.indexOf(ROW) === 0) {
          offset = -AXIS_TARGET + child[getSizeMethod]() / 2 + (child.margin || 0);
        } else {
          offset = AXIS_TARGET - child[getSizeMethod]() / 2 - (child.margin || 0);
        }
        break;
      case START:
      case "left":
      // @TODO : Deprecated and will be remove upon 7.x.x
      case "top":
        if (DIRECTION.indexOf(ROW) === 0) {
          offset = AXIS_TARGET - child[getSizeMethod]() / 2 - (child.margin || 0);
        } else {
          offset = -AXIS_TARGET + child[getSizeMethod]() / 2 + (child.margin || 0);
        }
        break;
    }
    boxComponent.childrenPos[child.id][axis] = offset || 0;
  });
}
function warnAboutDeprecatedAlignItems(alignment) {
  if (DEPRECATED_ALIGN_ITEMS.indexOf(alignment) !== -1) {
    console.warn(`alignItems === '${alignment}' is deprecated and will be remove in 7.x.x. Fallback are 'start'|'end'`);
  }
}
var AVAILABLE_ALIGN_ITEMS = [
  START,
  CENTER,
  END,
  STRETCH,
  "top",
  // @TODO: Be remove upon 7.x.x
  "right",
  // @TODO: Be remove upon 7.x.x
  "bottom",
  // @TODO: Be remove upon 7.x.x
  "left"
  // @TODO: Be remove upon 7.x.x
];
var DEPRECATED_ALIGN_ITEMS = [
  "top",
  "right",
  "bottom",
  "left"
];
var JustifyContent_START = "start";
var JustifyContent_CENTER = "center";
var JustifyContent_END = "end";
var SPACE_AROUND = "space-around";
var SPACE_BETWEEN = "space-between";
var SPACE_EVENLY = "space-evenly";
function justifyContent(boxComponent, direction, startPos, REVERSE) {
  const JUSTIFICATION = boxComponent.getJustifyContent();
  if (AVAILABLE_JUSTIFICATIONS.indexOf(JUSTIFICATION) === -1) {
    console.warn(`justifyContent === '${JUSTIFICATION}' is not supported`);
  }
  const side = direction.indexOf("row") === 0 ? "width" : "height";
  const usedDirectionSpace = boxComponent.getChildrenSideSum(side);
  const INNER_SIZE = side === "width" ? boxComponent.getInnerWidth() : boxComponent.getInnerHeight();
  const remainingSpace = INNER_SIZE - usedDirectionSpace;
  const axisOffset = startPos * 2 - usedDirectionSpace * Math.sign(startPos);
  const justificationOffset = _getJustificationOffset(JUSTIFICATION, axisOffset);
  const justificationMargins = _getJustificationMargin(boxComponent.childrenBoxes, remainingSpace, JUSTIFICATION, REVERSE);
  const axis = direction.indexOf("row") === 0 ? "x" : "y";
  boxComponent.childrenBoxes.forEach((child, childIndex) => {
    boxComponent.childrenPos[child.id][axis] -= justificationOffset - justificationMargins[childIndex];
  });
}
var AVAILABLE_JUSTIFICATIONS = [
  JustifyContent_START,
  JustifyContent_CENTER,
  JustifyContent_END,
  SPACE_AROUND,
  SPACE_BETWEEN,
  SPACE_EVENLY
];
function _getJustificationOffset(justification, axisOffset) {
  switch (justification) {
    case JustifyContent_END:
      return axisOffset;
    case JustifyContent_CENTER:
      return axisOffset / 2;
  }
  return 0;
}
function _getJustificationMargin(items, spaceToDistribute, justification, reverse) {
  const justificationMargins = Array(items.length).fill(0);
  if (spaceToDistribute > 0) {
    switch (justification) {
      case SPACE_BETWEEN:
        if (items.length > 1) {
          const margin = spaceToDistribute / (items.length - 1) * reverse;
          justificationMargins[0] = 0;
          for (let i = 1; i < items.length; i++) {
            justificationMargins[i] = margin * i;
          }
        }
        break;
      case SPACE_EVENLY:
        if (items.length > 1) {
          const margin = spaceToDistribute / (items.length + 1) * reverse;
          for (let i = 0; i < items.length; i++) {
            justificationMargins[i] = margin * (i + 1);
          }
        }
        break;
      case SPACE_AROUND:
        if (items.length > 1) {
          const margin = spaceToDistribute / items.length * reverse;
          const start = margin / 2;
          justificationMargins[0] = start;
          for (let i = 1; i < items.length; i++) {
            justificationMargins[i] = start + margin * i;
          }
        }
        break;
    }
  }
  return justificationMargins;
}
function BoxComponent(Base) {
  return class BoxComponent extends Base {
    constructor(options) {
      super(options);
      this.isBoxComponent = true;
      this.childrenPos = {};
    }
    /** Get width of this component minus its padding */
    getInnerWidth() {
      const DIRECTION = this.getContentDirection();
      switch (DIRECTION) {
        case "row":
        case "row-reverse":
          return this.width - (this.padding * 2 || 0) || this.getChildrenSideSum("width");
        case "column":
        case "column-reverse":
          return this.getHighestChildSizeOn("width");
        default:
          console.error(`Invalid contentDirection : ${DIRECTION}`);
          break;
      }
    }
    /** Get height of this component minus its padding */
    getInnerHeight() {
      const DIRECTION = this.getContentDirection();
      switch (DIRECTION) {
        case "row":
        case "row-reverse":
          return this.getHighestChildSizeOn("height");
        case "column":
        case "column-reverse":
          return this.height - (this.padding * 2 || 0) || this.getChildrenSideSum("height");
        default:
          console.error(`Invalid contentDirection : ${DIRECTION}`);
          break;
      }
    }
    /** Return the sum of all this component's children sides + their margin */
    getChildrenSideSum(dimension) {
      return this.childrenBoxes.reduce((accu, child) => {
        const margin = child.margin * 2 || 0;
        const CHILD_SIZE = dimension === "width" ? child.getWidth() + margin : child.getHeight() + margin;
        return accu + CHILD_SIZE;
      }, 0);
    }
    /** Look in parent record what is the instructed position for this component, then set its position */
    setPosFromParentRecords() {
      if (this.parentUI && this.parentUI.childrenPos[this.id]) {
        this.position.x = this.parentUI.childrenPos[this.id].x;
        this.position.y = this.parentUI.childrenPos[this.id].y;
      }
    }
    /** Position inner elements according to dimensions and layout parameters. */
    computeChildrenPosition() {
      if (this.children.length > 0) {
        const DIRECTION = this.getContentDirection();
        let directionalOffset;
        switch (DIRECTION) {
          case ROW:
            directionalOffset = -this.getInnerWidth() / 2;
            break;
          case ROW_REVERSE:
            directionalOffset = this.getInnerWidth() / 2;
            break;
          case COLUMN:
            directionalOffset = this.getInnerHeight() / 2;
            break;
          case COLUMN_REVERSE:
            directionalOffset = -this.getInnerHeight() / 2;
            break;
        }
        const REVERSE = -Math.sign(directionalOffset);
        contentDirection(this, DIRECTION, directionalOffset, REVERSE);
        justifyContent(this, DIRECTION, directionalOffset, REVERSE);
        alignItems(this, DIRECTION);
      }
    }
    /**
     * Returns the highest linear dimension among all the children of the passed component
     * MARGIN INCLUDED
     */
    getHighestChildSizeOn(direction) {
      return this.childrenBoxes.reduce((accu, child) => {
        const margin = child.margin || 0;
        const maxSize = direction === "width" ? child.getWidth() + margin * 2 : child.getHeight() + margin * 2;
        return Math.max(accu, maxSize);
      }, 0);
    }
    /**
     * Get width of this element
     * With padding, without margin
     */
    getWidth() {
      if (this.parentUI && this.parentUI.getAlignItems() === "stretch") {
        if (this.parentUI.getContentDirection().indexOf("column") !== -1) {
          return this.parentUI.getWidth() - (this.parentUI.padding * 2 || 0);
        }
      }
      return this.width || this.getInnerWidth() + (this.padding * 2 || 0);
    }
    /**
     * Get height of this element
     * With padding, without margin
     */
    getHeight() {
      if (this.parentUI && this.parentUI.getAlignItems() === "stretch") {
        if (this.parentUI.getContentDirection().indexOf("row") !== -1) {
          return this.parentUI.getHeight() - (this.parentUI.padding * 2 || 0);
        }
      }
      return this.height || this.getInnerHeight() + (this.padding * 2 || 0);
    }
  };
}
var WHITE_CHARS = { "	": "	", "\n": "\n", "\r": "\r", " ": " " };
var NORMAL = "normal";
var NOWRAP = "nowrap";
var PRE = "pre";
var PRE_LINE = "pre-line";
var PRE_WRAP = "pre-wrap";
var collapseWhitespaceOnString = function(textContent, whiteSpace) {
  switch (whiteSpace) {
    case NOWRAP:
    case NORMAL:
      textContent = textContent.replace(/\n/g, " ");
    //falls through
    case PRE_LINE:
      textContent = textContent.replace(/[ ]{2,}/g, " ");
      break;
    default:
  }
  return textContent;
};
var newlineBreakability = function(whiteSpace) {
  switch (whiteSpace) {
    case PRE:
    case PRE_WRAP:
    case PRE_LINE:
      return "mandatory";
    case NOWRAP:
    case NORMAL:
    default:
  }
};
var Whitespace_shouldBreak = function(inlines, i, lastInlineOffset, options) {
  const inline = inlines[i];
  switch (options.WHITESPACE) {
    case NORMAL:
    case PRE_LINE:
    case PRE_WRAP:
      if (inline.lineBreak === "mandatory") return true;
      const kerning = inline.kerning ? inline.kerning : 0;
      const xoffset = inline.xoffset ? inline.xoffset : 0;
      const xadvance = inline.xadvance ? inline.xadvance : inline.width;
      if (lastInlineOffset + xadvance + xoffset + kerning > options.INNER_WIDTH) return true;
      const nextBreak = _distanceToNextBreak(inlines, i, options);
      return _shouldFriendlyBreak(inlines[i - 1], lastInlineOffset, nextBreak, options);
    case PRE:
      return inline.lineBreak === "mandatory";
    case NOWRAP:
    default:
      return false;
  }
};
var collapseWhitespaceOnInlines = function(line, whiteSpace) {
  const firstInline = line[0];
  const lastInline = line[line.length - 1];
  switch (whiteSpace) {
    // trim/collapse first and last whitespace characters of a line
    case PRE_WRAP:
      if (firstInline.glyph && firstInline.glyph === "\n" && line.length > 1) {
        _collapseLeftInlines([firstInline], line[1]);
      }
      if (lastInline.glyph && lastInline.glyph === "\n" && line.length > 1) {
        _collapseRightInlines([lastInline], line[line.length - 2]);
      }
      break;
    case PRE_LINE:
    case NOWRAP:
    case NORMAL:
      let inlinesToCollapse = [];
      let collapsingTarget;
      for (let i = 0; i < line.length; i++) {
        const inline = line[i];
        if (inline.glyph && WHITE_CHARS[inline.glyph] && line.length > i) {
          inlinesToCollapse.push(inline);
          collapsingTarget = line[i + 1];
          continue;
        }
        break;
      }
      _collapseLeftInlines(inlinesToCollapse, collapsingTarget);
      inlinesToCollapse = [];
      collapsingTarget = null;
      for (let i = line.length - 1; i > 0; i--) {
        const inline = line[i];
        if (inline.glyph && WHITE_CHARS[inline.glyph] && i > 0) {
          inlinesToCollapse.push(inline);
          collapsingTarget = line[i - 1];
          continue;
        }
        break;
      }
      _collapseRightInlines(inlinesToCollapse, collapsingTarget);
      break;
    case PRE:
      break;
    default:
      console.warn(`whiteSpace: '${whiteSpace}' is not valid`);
      return 0;
  }
  return firstInline.offsetX;
};
function _collapseRightInlines(inlines, targetInline) {
  if (!targetInline) return;
  for (let i = 0; i < inlines.length; i++) {
    const inline = inlines[i];
    inline.width = 0;
    inline.height = 0;
    inline.offsetX = targetInline.offsetX + targetInline.width;
  }
}
function _collapseLeftInlines(inlines, targetInline) {
  if (!targetInline) return;
  for (let i = 0; i < inlines.length; i++) {
    const inline = inlines[i];
    inline.width = 0;
    inline.height = 0;
    inline.offsetX = targetInline.offsetX;
  }
}
function _distanceToNextBreak(inlines, currentIdx, options, accu) {
  accu = accu || 0;
  if (!inlines[currentIdx]) return accu;
  const inline = inlines[currentIdx];
  const kerning = inline.kerning ? inline.kerning : 0;
  const xoffset = inline.xoffset ? inline.xoffset : 0;
  const xadvance = inline.xadvance ? inline.xadvance : inline.width;
  if (inline.lineBreak) return accu + xadvance;
  return _distanceToNextBreak(
    inlines,
    currentIdx + 1,
    options,
    accu + xadvance + options.LETTERSPACING + xoffset + kerning
  );
}
function _shouldFriendlyBreak(prevChar, lastInlineOffset, nextBreak, options) {
  if (!prevChar || !prevChar.glyph) return false;
  if (lastInlineOffset + nextBreak < options.INNER_WIDTH) return false;
  return options.BREAKON.indexOf(prevChar.glyph) > -1;
}
var LEFT = "left";
var RIGHT = "right";
var TextAlign_CENTER = "center";
var JUSTIFY = "justify";
var JUSTIFY_LEFT = "justify-left";
var JUSTIFY_RIGHT = "justify-right";
var JUSTIFY_CENTER = "justify-center";
function textAlign(lines, ALIGNMENT, INNER_WIDTH) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const offsetX = _computeLineOffset(line, ALIGNMENT, INNER_WIDTH, i === lines.length - 1);
    for (let j = 0; j < line.length; j++) {
      line[j].offsetX += offsetX;
    }
    line.x = offsetX;
  }
  if (ALIGNMENT.indexOf(JUSTIFY) === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (ALIGNMENT.indexOf("-") !== -1 && i === lines.length - 1) return;
      const REMAINING_SPACE = INNER_WIDTH - line.width;
      if (REMAINING_SPACE <= 0) return;
      let validSpaces = 0;
      for (let j = 1; j < line.length - 1; j++) {
        validSpaces += line[j].glyph === " " ? 1 : 0;
      }
      const additionalSpace = REMAINING_SPACE / validSpaces;
      let inverter = 1;
      if (ALIGNMENT === JUSTIFY_RIGHT) {
        line.reverse();
        inverter = -1;
      }
      let incrementalOffsetX = 0;
      for (let j = 1; j <= line.length - 1; j++) {
        const char = line[j];
        char.offsetX += incrementalOffsetX * inverter;
        incrementalOffsetX += char.glyph === " " ? additionalSpace : 0;
      }
      if (ALIGNMENT === JUSTIFY_RIGHT) {
        line.reverse();
      }
    }
  }
}
var _computeLineOffset = (line, ALIGNMENT, INNER_WIDTH, lastLine) => {
  switch (ALIGNMENT) {
    case JUSTIFY_LEFT:
    case JUSTIFY:
    case LEFT:
      return -INNER_WIDTH / 2;
    case JUSTIFY_RIGHT:
    case RIGHT:
      return -line.width + INNER_WIDTH / 2;
    case TextAlign_CENTER:
      return -line.width / 2;
    case JUSTIFY_CENTER:
      if (lastLine) {
        return -line.width / 2;
      }
      return -INNER_WIDTH / 2;
    default:
      console.warn(`textAlign: '${ALIGNMENT}' is not valid`);
  }
};
function InlineManager(Base) {
  return class InlineManager extends Base {
    /** Compute children .inlines objects position, according to their pre-computed dimensions */
    computeInlinesPosition() {
      const INNER_WIDTH = this.getWidth() - (this.padding * 2 || 0);
      const INNER_HEIGHT = this.getHeight() - (this.padding * 2 || 0);
      const JUSTIFICATION = this.getJustifyContent();
      const ALIGNMENT = this.getTextAlign();
      const INTERLINE = this.getInterLine();
      const lines = this.computeLines();
      lines.interLine = INTERLINE;
      const textHeight = Math.abs(lines.height);
      const justificationOffset = (() => {
        switch (JUSTIFICATION) {
          case "start":
            return INNER_HEIGHT / 2;
          case "end":
            return textHeight - INNER_HEIGHT / 2;
          case "center":
            return textHeight / 2;
          default:
            console.warn(`justifyContent: '${JUSTIFICATION}' is not valid`);
        }
      })();
      lines.forEach((line) => {
        line.y += justificationOffset;
        line.forEach((inline) => {
          inline.offsetY += justificationOffset;
        });
      });
      textAlign(lines, ALIGNMENT, INNER_WIDTH);
      this.lines = lines;
    }
    calculateBestFit(bestFit) {
      if (this.childrenInlines.length === 0) return;
      switch (bestFit) {
        case "grow":
          this.calculateGrowFit();
          break;
        case "shrink":
          this.calculateShrinkFit();
          break;
        case "auto":
          this.calculateAutoFit();
          break;
      }
    }
    calculateGrowFit() {
      const INNER_HEIGHT = this.getHeight() - (this.padding * 2 || 0);
      let iterations = 1;
      const heightTolerance = 0.075;
      const firstText = this.childrenInlines.find((inlineComponent) => inlineComponent.isText);
      let minFontMultiplier = 1;
      let maxFontMultiplier = 2;
      let fontMultiplier = firstText._fitFontSize ? firstText._fitFontSize / firstText.getFontSize() : 1;
      let textHeight;
      do {
        textHeight = this.calculateHeight(fontMultiplier);
        if (textHeight > INNER_HEIGHT) {
          if (fontMultiplier <= minFontMultiplier) {
            this.childrenInlines.forEach((inlineComponent) => {
              if (inlineComponent.isInlineBlock) return;
              inlineComponent._fitFontSize = inlineComponent.getFontSize();
            });
            break;
          }
          maxFontMultiplier = fontMultiplier;
          fontMultiplier -= (maxFontMultiplier - minFontMultiplier) / 2;
        } else {
          if (Math.abs(INNER_HEIGHT - textHeight) < heightTolerance) break;
          if (Math.abs(fontMultiplier - maxFontMultiplier) < 5e-10) maxFontMultiplier *= 2;
          minFontMultiplier = fontMultiplier;
          fontMultiplier += (maxFontMultiplier - minFontMultiplier) / 2;
        }
      } while (++iterations <= 10);
    }
    calculateShrinkFit() {
      const INNER_HEIGHT = this.getHeight() - (this.padding * 2 || 0);
      let iterations = 1;
      const heightTolerance = 0.075;
      const firstText = this.childrenInlines.find((inlineComponent) => inlineComponent.isText);
      let minFontMultiplier = 0;
      let maxFontMultiplier = 1;
      let fontMultiplier = firstText._fitFontSize ? firstText._fitFontSize / firstText.getFontSize() : 1;
      let textHeight;
      do {
        textHeight = this.calculateHeight(fontMultiplier);
        if (textHeight > INNER_HEIGHT) {
          maxFontMultiplier = fontMultiplier;
          fontMultiplier -= (maxFontMultiplier - minFontMultiplier) / 2;
        } else {
          if (fontMultiplier >= maxFontMultiplier) {
            this.childrenInlines.forEach((inlineComponent) => {
              if (inlineComponent.isInlineBlock) return;
              inlineComponent._fitFontSize = inlineComponent.getFontSize();
            });
            break;
          }
          if (Math.abs(INNER_HEIGHT - textHeight) < heightTolerance) break;
          minFontMultiplier = fontMultiplier;
          fontMultiplier += (maxFontMultiplier - minFontMultiplier) / 2;
        }
      } while (++iterations <= 10);
    }
    calculateAutoFit() {
      const INNER_HEIGHT = this.getHeight() - (this.padding * 2 || 0);
      let iterations = 1;
      const heightTolerance = 0.075;
      const firstText = this.childrenInlines.find((inlineComponent) => inlineComponent.isText);
      let minFontMultiplier = 0;
      let maxFontMultiplier = 2;
      let fontMultiplier = firstText._fitFontSize ? firstText._fitFontSize / firstText.getFontSize() : 1;
      let textHeight;
      do {
        textHeight = this.calculateHeight(fontMultiplier);
        if (textHeight > INNER_HEIGHT) {
          maxFontMultiplier = fontMultiplier;
          fontMultiplier -= (maxFontMultiplier - minFontMultiplier) / 2;
        } else {
          if (Math.abs(INNER_HEIGHT - textHeight) < heightTolerance) break;
          if (Math.abs(fontMultiplier - maxFontMultiplier) < 5e-10) maxFontMultiplier *= 2;
          minFontMultiplier = fontMultiplier;
          fontMultiplier += (maxFontMultiplier - minFontMultiplier) / 2;
        }
      } while (++iterations <= 10);
    }
    /**
     * computes lines based on children's inlines array.
     * @private
     */
    computeLines() {
      const INNER_WIDTH = this.getWidth() - (this.padding * 2 || 0);
      const lines = [[]];
      lines.height = 0;
      const INTERLINE = this.getInterLine();
      this.childrenInlines.reduce((lastInlineOffset, inlineComponent) => {
        if (!inlineComponent.inlines) return;
        const FONTSIZE = inlineComponent._fitFontSize || inlineComponent.getFontSize();
        const LETTERSPACING = inlineComponent.isText ? inlineComponent.getLetterSpacing() * FONTSIZE : 0;
        const WHITESPACE = inlineComponent.getWhiteSpace();
        const BREAKON = inlineComponent.getBreakOn();
        const whiteSpaceOptions = {
          WHITESPACE,
          LETTERSPACING,
          BREAKON,
          INNER_WIDTH
        };
        const currentInlineInfo = inlineComponent.inlines.reduce((lastInlineOffset2, inline, i, inlines) => {
          const kerning = inline.kerning ? inline.kerning : 0;
          const xoffset = inline.xoffset ? inline.xoffset : 0;
          const xadvance = inline.xadvance ? inline.xadvance : inline.width;
          const shouldBreak = Whitespace_shouldBreak(inlines, i, lastInlineOffset2, whiteSpaceOptions);
          if (shouldBreak) {
            lines.push([inline]);
            inline.offsetX = xoffset;
            if (inline.width === 0) return 0;
            return xadvance + LETTERSPACING;
          }
          lines[lines.length - 1].push(inline);
          inline.offsetX = lastInlineOffset2 + xoffset + kerning;
          return lastInlineOffset2 + xadvance + kerning + LETTERSPACING;
        }, lastInlineOffset);
        return currentInlineInfo;
      }, 0);
      let width = 0, height = 0, lineOffsetY = -INTERLINE / 2;
      lines.forEach((line) => {
        line.lineHeight = line.reduce((height2, inline) => {
          const charHeight = inline.lineHeight !== void 0 ? inline.lineHeight : inline.height;
          return Math.max(height2, charHeight);
        }, 0);
        line.lineBase = line.reduce((lineBase, inline) => {
          const newLineBase = inline.lineBase !== void 0 ? inline.lineBase : inline.height;
          return Math.max(lineBase, newLineBase);
        }, 0);
        line.width = 0;
        line.height = line.lineHeight;
        const lineHasInlines = line[0];
        if (lineHasInlines) {
          const WHITESPACE = this.getWhiteSpace();
          const whiteSpaceOffset = collapseWhitespaceOnInlines(line, WHITESPACE);
          line.forEach((inline) => {
            inline.offsetX -= whiteSpaceOffset;
          });
          line.width = this.computeLineWidth(line);
          if (line.width > width) {
            width = line.width;
          }
          line.forEach((inline) => {
            inline.offsetY = lineOffsetY - inline.height - inline.anchor;
            if (inline.lineHeight < line.lineHeight) {
              inline.offsetY -= line.lineBase - inline.lineBase;
            }
          });
          line.y = lineOffsetY;
          height += line.lineHeight + INTERLINE;
          lineOffsetY = lineOffsetY - (line.lineHeight + INTERLINE);
        }
      });
      lines.height = height;
      lines.width = width;
      return lines;
    }
    calculateHeight(fontMultiplier) {
      this.childrenInlines.forEach((inlineComponent) => {
        if (inlineComponent.isInlineBlock) return;
        inlineComponent._fitFontSize = inlineComponent.getFontSize() * fontMultiplier;
        inlineComponent.calculateInlines(inlineComponent._fitFontSize);
      });
      const lines = this.computeLines();
      return Math.abs(lines.height);
    }
    /**
     * Compute the width of a line
     * @param line
     * @returns {number}
     */
    computeLineWidth(line) {
      const firstInline = line[0];
      const lastInline = line[line.length - 1];
      return lastInline.offsetX + lastInline.width + firstInline.offsetX;
    }
  };
}
var fileLoader = new external_three_namespaceObject.FileLoader();
var requiredFontFamilies = [];
var fontFamilies = {};
var textureLoader = new external_three_namespaceObject.TextureLoader();
var requiredFontTextures = [];
var fontTextures = {};
var records = {};
function setFontFamily(component, fontFamily) {
  if (typeof fontFamily === "string") {
    loadFontJSON(component, fontFamily);
  } else {
    if (!records[component.id]) records[component.id] = { component };
    _buildFriendlyKerningValues(fontFamily);
    records[component.id].json = fontFamily;
    component._updateFontFamily(fontFamily);
  }
}
function setFontTexture(component, url) {
  if (requiredFontTextures.indexOf(url) === -1) {
    requiredFontTextures.push(url);
    textureLoader.load(url, (texture) => {
      texture.generateMipmaps = false;
      texture.minFilter = external_three_namespaceObject.LinearFilter;
      texture.magFilter = external_three_namespaceObject.LinearFilter;
      fontTextures[url] = texture;
      for (const recordID of Object.keys(records)) {
        if (url === records[recordID].textureURL) {
          records[recordID].component._updateFontTexture(texture);
        }
      }
    });
  }
  if (!records[component.id]) records[component.id] = { component };
  records[component.id].textureURL = url;
  if (fontTextures[url]) {
    component._updateFontTexture(fontTextures[url]);
  }
}
function getFontOf(component) {
  const record = records[component.id];
  if (!record && component.parentUI) {
    return getFontOf(component.parentUI);
  }
  return record;
}
function loadFontJSON(component, url) {
  if (requiredFontFamilies.indexOf(url) === -1) {
    requiredFontFamilies.push(url);
    fileLoader.load(url, (text) => {
      const font = JSON.parse(text);
      _buildFriendlyKerningValues(font);
      fontFamilies[url] = font;
      for (const recordID of Object.keys(records)) {
        if (url === records[recordID].jsonURL) {
          records[recordID].component._updateFontFamily(font);
        }
      }
    });
  }
  if (!records[component.id]) records[component.id] = { component };
  records[component.id].jsonURL = url;
  if (fontFamilies[url]) {
    component._updateFontFamily(fontFamilies[url]);
  }
}
function _buildFriendlyKerningValues(font) {
  if (font._kernings) return;
  const friendlyKernings = {};
  for (let i = 0; i < font.kernings.length; i++) {
    const kerning = font.kernings[i];
    if (kerning.amount === 0) continue;
    const glyphPair = String.fromCharCode(kerning.first, kerning.second);
    friendlyKernings[glyphPair] = kerning.amount;
  }
  font._kernings = friendlyKernings;
}
function addFont(name, json, texture) {
  texture.generateMipmaps = false;
  texture.minFilter = external_three_namespaceObject.LinearFilter;
  texture.magFilter = external_three_namespaceObject.LinearFilter;
  requiredFontFamilies.push(name);
  fontFamilies[name] = json;
  _buildFriendlyKerningValues(json);
  if (texture) {
    requiredFontTextures.push(name);
    fontTextures[name] = texture;
  }
}
var FontLibrary = {
  setFontFamily,
  setFontTexture,
  getFontOf,
  addFont
};
var core_FontLibrary = FontLibrary;
var UpdateManager = class {
  /*
   * get called by MeshUIComponent when component.set has been used.
   * It registers this component and all its descendants for the different types of updates that were required.
   */
  static requestUpdate(component, updateParsing, updateLayout, updateInner) {
    component.traverse((child) => {
      if (!child.isUI) return;
      if (!this.requestedUpdates[child.id]) {
        this.requestedUpdates[child.id] = {
          updateParsing,
          updateLayout,
          updateInner,
          needCallback: updateParsing || updateLayout || updateInner
        };
      } else {
        if (updateParsing) this.requestedUpdates[child.id].updateParsing = true;
        if (updateLayout) this.requestedUpdates[child.id].updateLayout = true;
        if (updateInner) this.requestedUpdates[child.id].updateInner = true;
      }
    });
  }
  /** Register a passed component for later updates */
  static register(component) {
    if (!this.components.includes(component)) {
      this.components.push(component);
    }
  }
  /** Unregister a component (when it's deleted for instance) */
  static disposeOf(component) {
    const idx = this.components.indexOf(component);
    if (idx > -1) {
      this.components.splice(idx, 1);
    }
  }
  /** Trigger all requested updates of registered components */
  static update() {
    if (Object.keys(this.requestedUpdates).length > 0) {
      const roots = this.components.filter((component) => {
        return !component.parentUI;
      });
      roots.forEach((root) => this.traverseParsing(root));
      roots.forEach((root) => this.traverseUpdates(root));
    }
  }
  /**
   * Calls parseParams update of all components from parent to children
   * @private
   */
  static traverseParsing(component) {
    const request = this.requestedUpdates[component.id];
    if (request && request.updateParsing) {
      component.parseParams();
      request.updateParsing = false;
    }
    component.childrenUIs.forEach((child) => this.traverseParsing(child));
  }
  /**
   * Calls updateLayout and updateInner functions of components that need an update
   * @private
   */
  static traverseUpdates(component) {
    const request = this.requestedUpdates[component.id];
    delete this.requestedUpdates[component.id];
    if (request && request.updateLayout) {
      request.updateLayout = false;
      component.updateLayout();
    }
    if (request && request.updateInner) {
      request.updateInner = false;
      component.updateInner();
    }
    component.childrenUIs.forEach((childUI) => {
      this.traverseUpdates(childUI);
    });
    if (request && request.needCallback) {
      component.onAfterUpdate();
    }
  }
};
UpdateManager.components = [];
UpdateManager.requestedUpdates = {};
var Defaults = {
  container: null,
  fontFamily: null,
  fontSize: 0.05,
  fontKerning: "normal",
  // FontKerning would act like css : "none"|"normal"|"auto"("auto" not yet implemented)
  bestFit: "none",
  offset: 0.01,
  interLine: 0.01,
  breakOn: "- ,.:?!\n",
  // added '\n' to also acts as friendly breaks when white-space:normal
  whiteSpace: PRE_LINE,
  contentDirection: COLUMN,
  alignItems: CENTER,
  justifyContent: JustifyContent_START,
  textAlign: TextAlign_CENTER,
  textType: "MSDF",
  fontColor: new external_three_namespaceObject.Color(16777215),
  fontOpacity: 1,
  fontPXRange: 4,
  fontSupersampling: true,
  borderRadius: 0.01,
  borderWidth: 0,
  borderColor: new external_three_namespaceObject.Color("black"),
  borderOpacity: 1,
  backgroundSize: "cover",
  backgroundColor: new external_three_namespaceObject.Color(2236962),
  backgroundWhiteColor: new external_three_namespaceObject.Color(16777215),
  backgroundOpacity: 0.8,
  backgroundOpaqueOpacity: 1,
  // this default value is a function to avoid initialization issues (see issue #126)
  getDefaultTexture,
  hiddenOverflow: false,
  letterSpacing: 0
};
var defaultTexture;
function getDefaultTexture() {
  if (!defaultTexture) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 1;
    ctx.canvas.height = 1;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1, 1);
    defaultTexture = new external_three_namespaceObject.CanvasTexture(ctx.canvas);
    defaultTexture.isDefault = true;
  }
  return defaultTexture;
}
function MeshUIComponent(Base) {
  return class MeshUIComponent extends Base {
    constructor(options) {
      super(options);
      /**
       * Try to retrieve parentUI after each structural change
       * @private
       */
      __publicField(this, "_rebuildParentUI", () => {
        if (this.parent && this.parent.isUI) {
          this.parentUI = this.parent;
        } else {
          this.parentUI = null;
        }
      });
      this.states = {};
      this.currentState = void 0;
      this.isUI = true;
      this.autoLayout = true;
      this.childrenUIs = [];
      this.childrenBoxes = [];
      this.childrenTexts = [];
      this.childrenInlines = [];
      this.parentUI = null;
      this.addEventListener("added", this._rebuildParentUI);
      this.addEventListener("removed", this._rebuildParentUI);
    }
    /////////////
    /// GETTERS
    /////////////
    getClippingPlanes() {
      const planes = [];
      if (this.parentUI) {
        if (this.isBlock && this.parentUI.getHiddenOverflow()) {
          const yLimit = this.parentUI.getHeight() / 2 - (this.parentUI.padding || 0);
          const xLimit = this.parentUI.getWidth() / 2 - (this.parentUI.padding || 0);
          const newPlanes = [
            new external_three_namespaceObject.Plane(new external_three_namespaceObject.Vector3(0, 1, 0), yLimit),
            new external_three_namespaceObject.Plane(new external_three_namespaceObject.Vector3(0, -1, 0), yLimit),
            new external_three_namespaceObject.Plane(new external_three_namespaceObject.Vector3(1, 0, 0), xLimit),
            new external_three_namespaceObject.Plane(new external_three_namespaceObject.Vector3(-1, 0, 0), xLimit)
          ];
          newPlanes.forEach((plane) => {
            plane.applyMatrix4(this.parent.matrixWorld);
          });
          planes.push(...newPlanes);
        }
        if (this.parentUI.parentUI) {
          planes.push(...this.parentUI.getClippingPlanes());
        }
      }
      return planes;
    }
    /** Get the highest parent of this component (the parent that has no parent on top of it) */
    getHighestParent() {
      if (!this.parentUI) {
        return this;
      }
      return this.parent.getHighestParent();
    }
    /**
     * look for a property in this object, and if does not find it, find in parents or return default value
     * @private
     */
    _getProperty(propName) {
      if (this[propName] === void 0 && this.parentUI) {
        return this.parent._getProperty(propName);
      } else if (this[propName] !== void 0) {
        return this[propName];
      }
      return Defaults[propName];
    }
    //
    getFontSize() {
      return this._getProperty("fontSize");
    }
    getFontKerning() {
      return this._getProperty("fontKerning");
    }
    getLetterSpacing() {
      return this._getProperty("letterSpacing");
    }
    getFontTexture() {
      if (this["fontTexture"] === void 0 && this.parentUI) {
        return this.parent._getProperty("fontTexture");
      } else if (this["fontTexture"] !== void 0) {
        return this["fontTexture"];
      }
      return Defaults.getDefaultTexture();
    }
    getFontFamily() {
      return this._getProperty("fontFamily");
    }
    getBreakOn() {
      return this._getProperty("breakOn");
    }
    getWhiteSpace() {
      return this._getProperty("whiteSpace");
    }
    getTextAlign() {
      return this._getProperty("textAlign");
    }
    getTextType() {
      return this._getProperty("textType");
    }
    getFontColor() {
      return this._getProperty("fontColor");
    }
    getFontSupersampling() {
      return this._getProperty("fontSupersampling");
    }
    getFontOpacity() {
      return this._getProperty("fontOpacity");
    }
    getFontPXRange() {
      return this._getProperty("fontPXRange");
    }
    getBorderRadius() {
      return this._getProperty("borderRadius");
    }
    getBorderWidth() {
      return this._getProperty("borderWidth");
    }
    getBorderColor() {
      return this._getProperty("borderColor");
    }
    getBorderOpacity() {
      return this._getProperty("borderOpacity");
    }
    /// SPECIALS
    /** return the first parent with a 'threeOBJ' property */
    getContainer() {
      if (!this.threeOBJ && this.parent) {
        return this.parent.getContainer();
      } else if (this.threeOBJ) {
        return this;
      }
      return Defaults.container;
    }
    /** Get the number of UI parents above this elements (0 if no parent) */
    getParentsNumber(i) {
      i = i || 0;
      if (this.parentUI) {
        return this.parentUI.getParentsNumber(i + 1);
      }
      return i;
    }
    ////////////////////////////////////
    /// GETTERS WITH NO PARENTS LOOKUP
    ////////////////////////////////////
    getBackgroundOpacity() {
      return !this.backgroundOpacity && this.backgroundOpacity !== 0 ? Defaults.backgroundOpacity : this.backgroundOpacity;
    }
    getBackgroundColor() {
      return this.backgroundColor || Defaults.backgroundColor;
    }
    getBackgroundTexture() {
      return this.backgroundTexture || Defaults.getDefaultTexture();
    }
    /**
     * @deprecated
     * @returns {string}
     */
    getAlignContent() {
      return this.alignContent || Defaults.alignContent;
    }
    getAlignItems() {
      return this.alignItems || Defaults.alignItems;
    }
    getContentDirection() {
      return this.contentDirection || Defaults.contentDirection;
    }
    getJustifyContent() {
      return this.justifyContent || Defaults.justifyContent;
    }
    getInterLine() {
      return this.interLine === void 0 ? Defaults.interLine : this.interLine;
    }
    getOffset() {
      return this.offset === void 0 ? Defaults.offset : this.offset;
    }
    getBackgroundSize() {
      return this.backgroundSize === void 0 ? Defaults.backgroundSize : this.backgroundSize;
    }
    getHiddenOverflow() {
      return this.hiddenOverflow === void 0 ? Defaults.hiddenOverflow : this.hiddenOverflow;
    }
    getBestFit() {
      return this.bestFit === void 0 ? Defaults.bestFit : this.bestFit;
    }
    ///////////////
    ///  UPDATE
    ///////////////
    /**
     * Filters children in order to compute only one times children lists
     * @private
     */
    _rebuildChildrenLists() {
      this.childrenUIs = this.children.filter((child) => child.isUI);
      this.childrenBoxes = this.children.filter((child) => child.isBoxComponent);
      this.childrenInlines = this.children.filter((child) => child.isInline);
      this.childrenTexts = this.children.filter((child) => child.isText);
    }
    /**
     * When the user calls component.add, it registers for updates,
     * then call THREE.Object3D.add.
     */
    add() {
      for (const id of Object.keys(arguments)) {
        if (arguments[id].isInline) this.update(null, true);
      }
      const result = super.add(...arguments);
      this._rebuildChildrenLists();
      return result;
    }
    /**
     * When the user calls component.remove, it registers for updates,
     * then call THREE.Object3D.remove.
     */
    remove() {
      for (const id of Object.keys(arguments)) {
        if (arguments[id].isInline) this.update(null, true);
      }
      const result = super.remove(...arguments);
      this._rebuildChildrenLists();
      return result;
    }
    //
    update(updateParsing, updateLayout, updateInner) {
      UpdateManager.requestUpdate(this, updateParsing, updateLayout, updateInner);
    }
    onAfterUpdate() {
    }
    /**
     * Called by FontLibrary when the font requested for the current component is ready.
     * Trigger an update for the component whose font is now available.
     * @private - "package protected"
     */
    _updateFontFamily(font) {
      this.fontFamily = font;
      this.traverse((child) => {
        if (child.isUI) child.update(true, true, false);
      });
      this.getHighestParent().update(false, true, false);
    }
    /** @private - "package protected" */
    _updateFontTexture(texture) {
      this.fontTexture = texture;
      this.getHighestParent().update(false, true, false);
    }
    /**
     * Set this component's passed parameters.
     * If necessary, take special actions.
     * Update this component unless otherwise specified.
     */
    set(options) {
      let parsingNeedsUpdate, layoutNeedsUpdate, innerNeedsUpdate;
      UpdateManager.register(this);
      if (!options || JSON.stringify(options) === JSON.stringify({})) return;
      if (options["alignContent"]) {
        options["alignItems"] = options["alignContent"];
        if (!options["textAlign"]) {
          options["textAlign"] = options["alignContent"];
        }
        console.warn("`alignContent` property has been deprecated, please rely on `alignItems` and `textAlign` instead.");
        delete options["alignContent"];
      }
      if (options["alignItems"]) {
        warnAboutDeprecatedAlignItems(options["alignItems"]);
      }
      for (const prop of Object.keys(options)) {
        if (this[prop] != options[prop]) {
          switch (prop) {
            case "content":
            case "fontSize":
            case "fontKerning":
            case "breakOn":
            case "whiteSpace":
              if (this.isText) parsingNeedsUpdate = true;
              layoutNeedsUpdate = true;
              this[prop] = options[prop];
              break;
            case "bestFit":
              if (this.isBlock) {
                parsingNeedsUpdate = true;
                layoutNeedsUpdate = true;
              }
              this[prop] = options[prop];
              break;
            case "width":
            case "height":
            case "padding":
              if (this.isInlineBlock || this.isBlock && this.getBestFit() != "none") parsingNeedsUpdate = true;
              layoutNeedsUpdate = true;
              this[prop] = options[prop];
              break;
            case "letterSpacing":
            case "interLine":
              if (this.isBlock && this.getBestFit() != "none") parsingNeedsUpdate = true;
              layoutNeedsUpdate = true;
              this[prop] = options[prop];
              break;
            case "margin":
            case "contentDirection":
            case "justifyContent":
            case "alignContent":
            case "alignItems":
            case "textAlign":
            case "textType":
              layoutNeedsUpdate = true;
              this[prop] = options[prop];
              break;
            case "fontColor":
            case "fontOpacity":
            case "fontSupersampling":
            case "offset":
            case "backgroundColor":
            case "backgroundOpacity":
            case "backgroundTexture":
            case "backgroundSize":
            case "borderRadius":
            case "borderWidth":
            case "borderColor":
            case "borderOpacity":
              innerNeedsUpdate = true;
              this[prop] = options[prop];
              break;
            case "hiddenOverflow":
              this[prop] = options[prop];
              break;
          }
        }
      }
      if (options.fontFamily) {
        core_FontLibrary.setFontFamily(this, options.fontFamily);
      }
      if (options.fontTexture) {
        core_FontLibrary.setFontTexture(this, options.fontTexture);
      }
      if (this.parentUI && this.parentUI.getBestFit() != "none") this.parentUI.update(true, true, false);
      this.update(parsingNeedsUpdate, layoutNeedsUpdate, innerNeedsUpdate);
      if (layoutNeedsUpdate) this.getHighestParent().update(false, true, false);
    }
    /////////////////////
    // STATES MANAGEMENT
    /////////////////////
    /** Store a new state in this component, with linked attributes */
    setupState(options) {
      this.states[options.state] = {
        attributes: options.attributes,
        onSet: options.onSet
      };
    }
    /** Set the attributes of a stored state of this component */
    setState(state) {
      const savedState = this.states[state];
      if (!savedState) {
        console.warn(`state "${state}" does not exist within this component:`, this.name);
        return;
      }
      if (state === this.currentState) return;
      this.currentState = state;
      if (savedState.onSet) savedState.onSet();
      if (savedState.attributes) this.set(savedState.attributes);
    }
    /** Get completely rid of this component and its children, also unregister it for updates */
    clear() {
      this.traverse((obj) => {
        UpdateManager.disposeOf(obj);
        if (obj.material) obj.material.dispose();
        if (obj.geometry) obj.geometry.dispose();
      });
    }
  };
}
function MaterialManager(Base) {
  return class MaterialManager extends Base {
    constructor(options) {
      super(options);
      this.textUniforms = {
        u_texture: { value: this.getFontTexture() },
        u_color: { value: this.getFontColor() },
        u_opacity: { value: this.getFontOpacity() },
        u_pxRange: { value: this.getFontPXRange() },
        u_useRGSS: { value: this.getFontSupersampling() }
      };
      this.backgroundUniforms = {
        u_texture: { value: this.getBackgroundTexture() },
        u_color: { value: this.getBackgroundColor() },
        u_opacity: { value: this.getBackgroundOpacity() },
        u_backgroundMapping: { value: this.getBackgroundSize() },
        u_borderWidth: { value: this.getBorderWidth() },
        u_borderColor: { value: this.getBorderColor() },
        u_borderRadiusTopLeft: { value: this.getBorderRadius() },
        u_borderRadiusTopRight: { value: this.getBorderRadius() },
        u_borderRadiusBottomRight: { value: this.getBorderRadius() },
        u_borderRadiusBottomLeft: { value: this.getBorderRadius() },
        u_borderOpacity: { value: this.getBorderOpacity() },
        u_size: { value: new external_three_namespaceObject.Vector2(1, 1) },
        u_tSize: { value: new external_three_namespaceObject.Vector2(1, 1) }
      };
    }
    /**
     * Update backgroundMaterial uniforms.
     * Used within MaterialManager and in Block and InlineBlock innerUpdates.
     */
    updateBackgroundMaterial() {
      this.backgroundUniforms.u_texture.value = this.getBackgroundTexture();
      this.backgroundUniforms.u_tSize.value.set(
        this.backgroundUniforms.u_texture.value.image.width,
        this.backgroundUniforms.u_texture.value.image.height
      );
      if (this.size) this.backgroundUniforms.u_size.value.copy(this.size);
      if (this.backgroundUniforms.u_texture.value.isDefault) {
        this.backgroundUniforms.u_color.value = this.getBackgroundColor();
        this.backgroundUniforms.u_opacity.value = this.getBackgroundOpacity();
      } else {
        this.backgroundUniforms.u_color.value = this.backgroundColor || Defaults.backgroundWhiteColor;
        this.backgroundUniforms.u_opacity.value = !this.backgroundOpacity && this.backgroundOpacity !== 0 ? Defaults.backgroundOpaqueOpacity : this.backgroundOpacity;
      }
      this.backgroundUniforms.u_backgroundMapping.value = (() => {
        switch (this.getBackgroundSize()) {
          case "stretch":
            return 0;
          case "contain":
            return 1;
          case "cover":
            return 2;
        }
      })();
      const borderRadius = this.getBorderRadius();
      this.backgroundUniforms.u_borderWidth.value = this.getBorderWidth();
      this.backgroundUniforms.u_borderColor.value = this.getBorderColor();
      this.backgroundUniforms.u_borderOpacity.value = this.getBorderOpacity();
      if (Array.isArray(borderRadius)) {
        this.backgroundUniforms.u_borderRadiusTopLeft.value = borderRadius[0];
        this.backgroundUniforms.u_borderRadiusTopRight.value = borderRadius[1];
        this.backgroundUniforms.u_borderRadiusBottomRight.value = borderRadius[2];
        this.backgroundUniforms.u_borderRadiusBottomLeft.value = borderRadius[3];
      } else {
        this.backgroundUniforms.u_borderRadiusTopLeft.value = borderRadius;
        this.backgroundUniforms.u_borderRadiusTopRight.value = borderRadius;
        this.backgroundUniforms.u_borderRadiusBottomRight.value = borderRadius;
        this.backgroundUniforms.u_borderRadiusBottomLeft.value = borderRadius;
      }
    }
    /**
     * Update backgroundMaterial uniforms.
     * Used within MaterialManager and in Text innerUpdates.
     */
    updateTextMaterial() {
      this.textUniforms.u_texture.value = this.getFontTexture();
      this.textUniforms.u_color.value = this.getFontColor();
      this.textUniforms.u_opacity.value = this.getFontOpacity();
      this.textUniforms.u_pxRange.value = this.getFontPXRange();
      this.textUniforms.u_useRGSS.value = this.getFontSupersampling();
    }
    /** Called by Block, which needs the background material to create a mesh */
    getBackgroundMaterial() {
      if (!this.backgroundMaterial || !this.backgroundUniforms) {
        this.backgroundMaterial = this._makeBackgroundMaterial();
      }
      return this.backgroundMaterial;
    }
    /** Called by Text to get the font material */
    getFontMaterial() {
      if (!this.fontMaterial || !this.textUniforms) {
        this.fontMaterial = this._makeTextMaterial();
      }
      return this.fontMaterial;
    }
    /** @private */
    _makeTextMaterial() {
      return new external_three_namespaceObject.ShaderMaterial({
        uniforms: this.textUniforms,
        transparent: true,
        clipping: true,
        vertexShader: textVertex,
        fragmentShader: textFragment,
        extensions: {
          derivatives: true
        }
      });
    }
    /** @private */
    _makeBackgroundMaterial() {
      return new external_three_namespaceObject.ShaderMaterial({
        uniforms: this.backgroundUniforms,
        transparent: true,
        clipping: true,
        vertexShader: backgroundVertex,
        fragmentShader: backgroundFragment,
        extensions: {
          derivatives: true
        }
      });
    }
    /**
     * Update a component's materials clipping planes.
     * Called every frame.
     */
    updateClippingPlanes(value) {
      const newClippingPlanes = value !== void 0 ? value : this.getClippingPlanes();
      if (JSON.stringify(newClippingPlanes) !== JSON.stringify(this.clippingPlanes)) {
        this.clippingPlanes = newClippingPlanes;
        if (this.fontMaterial) this.fontMaterial.clippingPlanes = this.clippingPlanes;
        if (this.backgroundMaterial) this.backgroundMaterial.clippingPlanes = this.clippingPlanes;
      }
    }
  };
}
var textVertex = `
varying vec2 vUv;

#include <clipping_planes_pars_vertex>

void main() {

	vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
	gl_Position.z -= 0.00001;

	#include <clipping_planes_vertex>

}
`;
var textFragment = `

uniform sampler2D u_texture;
uniform vec3 u_color;
uniform float u_opacity;
uniform float u_pxRange;
uniform bool u_useRGSS;

varying vec2 vUv;

#include <clipping_planes_pars_fragment>

// functions from the original msdf repo:
// https://github.com/Chlumsky/msdfgen#using-a-multi-channel-distance-field

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(u_pxRange)/vec2(textureSize(u_texture, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(vUv);
	return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

float tap(vec2 offsetUV) {
	vec3 msd = texture( u_texture, offsetUV ).rgb;
	float sd = median(msd.r, msd.g, msd.b);
	float screenPxDistance = screenPxRange() * (sd - 0.5);
	float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
	return alpha;
}

void main() {

	float alpha;

	if ( u_useRGSS ) {

		// shader-based supersampling based on https://bgolus.medium.com/sharper-mipmapping-using-shader-based-supersampling-ed7aadb47bec
		// per pixel partial derivatives
		vec2 dx = dFdx(vUv);
		vec2 dy = dFdy(vUv);

		// rotated grid uv offsets
		vec2 uvOffsets = vec2(0.125, 0.375);
		vec2 offsetUV = vec2(0.0, 0.0);

		// supersampled using 2x2 rotated grid
		alpha = 0.0;
		offsetUV.xy = vUv + uvOffsets.x * dx + uvOffsets.y * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv - uvOffsets.x * dx - uvOffsets.y * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv + uvOffsets.y * dx - uvOffsets.x * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv - uvOffsets.y * dx + uvOffsets.x * dy;
		alpha += tap(offsetUV);
		alpha *= 0.25;

	} else {

		alpha = tap( vUv );

	}


	// apply the opacity
	alpha *= u_opacity;

	// this is useful to avoid z-fighting when quads overlap because of kerning
	if ( alpha < 0.02) discard;


	gl_FragColor = vec4( u_color, alpha );

	#include <clipping_planes_fragment>

}
`;
var backgroundVertex = `
varying vec2 vUv;

#include <clipping_planes_pars_vertex>

void main() {

	vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

	#include <clipping_planes_vertex>

}
`;
var backgroundFragment = `

uniform sampler2D u_texture;
uniform vec3 u_color;
uniform float u_opacity;

uniform float u_borderRadiusTopLeft;
uniform float u_borderRadiusTopRight;
uniform float u_borderRadiusBottomLeft;
uniform float u_borderRadiusBottomRight;
uniform float u_borderWidth;
uniform vec3 u_borderColor;
uniform float u_borderOpacity;
uniform vec2 u_size;
uniform vec2 u_tSize;
uniform int u_backgroundMapping;

varying vec2 vUv;

#include <clipping_planes_pars_fragment>

float getEdgeDist() {
	vec2 ndc = vec2( vUv.x * 2.0 - 1.0, vUv.y * 2.0 - 1.0 );
	vec2 planeSpaceCoord = vec2( u_size.x * 0.5 * ndc.x, u_size.y * 0.5 * ndc.y );
	vec2 corner = u_size * 0.5;
	vec2 offsetCorner = corner - abs( planeSpaceCoord );
	float innerRadDist = min( offsetCorner.x, offsetCorner.y ) * -1.0;
	if (vUv.x < 0.5 && vUv.y >= 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusTopLeft, 0.0 ) ) - u_borderRadiusTopLeft;
		float s = step( innerRadDist * -1.0, u_borderRadiusTopLeft );
		return mix( innerRadDist, roundedDist, s );
	}
	if (vUv.x >= 0.5 && vUv.y >= 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusTopRight, 0.0 ) ) - u_borderRadiusTopRight;
		float s = step( innerRadDist * -1.0, u_borderRadiusTopRight );
		return mix( innerRadDist, roundedDist, s );
	}
	if (vUv.x >= 0.5 && vUv.y < 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusBottomRight, 0.0 ) ) - u_borderRadiusBottomRight;
		float s = step( innerRadDist * -1.0, u_borderRadiusBottomRight );
		return mix( innerRadDist, roundedDist, s );
	}
	if (vUv.x < 0.5 && vUv.y < 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusBottomLeft, 0.0 ) ) - u_borderRadiusBottomLeft;
		float s = step( innerRadDist * -1.0, u_borderRadiusBottomLeft );
		return mix( innerRadDist, roundedDist, s );
	}
}

vec4 sampleTexture() {
	float textureRatio = u_tSize.x / u_tSize.y;
	float panelRatio = u_size.x / u_size.y;
	vec2 uv = vUv;
	if ( u_backgroundMapping == 1 ) { // contain
		if ( textureRatio < panelRatio ) { // repeat on X
			float newX = uv.x * ( panelRatio / textureRatio );
			newX += 0.5 - 0.5 * ( panelRatio / textureRatio );
			uv.x = newX;
		} else { // repeat on Y
			float newY = uv.y * ( textureRatio / panelRatio );
			newY += 0.5 - 0.5 * ( textureRatio / panelRatio );
			uv.y = newY;
		}
	} else if ( u_backgroundMapping == 2 ) { // cover
		if ( textureRatio < panelRatio ) { // stretch on Y
			float newY = uv.y * ( textureRatio / panelRatio );
			newY += 0.5 - 0.5 * ( textureRatio / panelRatio );
			uv.y = newY;
		} else { // stretch on X
			float newX = uv.x * ( panelRatio / textureRatio );
			newX += 0.5 - 0.5 * ( panelRatio / textureRatio );
			uv.x = newX;
		}
	}
	return texture2D( u_texture, uv ).rgba;
}

void main() {

	float edgeDist = getEdgeDist();
	float change = fwidth( edgeDist );

	vec4 textureSample = sampleTexture();
	vec3 blendedColor = textureSample.rgb * u_color;

	float alpha = smoothstep( change, 0.0, edgeDist );
	float blendedOpacity = u_opacity * textureSample.a * alpha;

	vec4 frameColor = vec4( blendedColor, blendedOpacity );

	if ( u_borderWidth <= 0.0 ) {
		gl_FragColor = frameColor;
	} else {
		vec4 borderColor = vec4( u_borderColor, u_borderOpacity * alpha );
		float stp = smoothstep( edgeDist + change, edgeDist, u_borderWidth * -1.0 );
		gl_FragColor = mix( frameColor, borderColor, stp );
	}

	#include <clipping_planes_fragment>
}
`;
var Frame = class extends external_three_namespaceObject.Mesh {
  constructor(material) {
    const geometry = new external_three_namespaceObject.PlaneGeometry();
    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
    this.name = "MeshUI-Frame";
  }
};
var _Base = null;
function mix(...mixins) {
  if (!_Base) {
    throw new Error("Cannot use mixins with Base null");
  }
  let Base = _Base;
  _Base = null;
  let i = mixins.length;
  let mixin;
  while (--i >= 0) {
    mixin = mixins[i];
    Base = mixin(Base);
  }
  return Base;
}
mix.withBase = (Base) => {
  _Base = Base;
  return mix;
};
var Block = class extends mix.withBase(external_three_namespaceObject.Object3D)(
  BoxComponent,
  InlineManager,
  MaterialManager,
  MeshUIComponent
) {
  constructor(options) {
    super(options);
    this.isBlock = true;
    this.size = new external_three_namespaceObject.Vector2(1, 1);
    this.frame = new Frame(this.getBackgroundMaterial());
    this.frame.onBeforeRender = () => {
      if (this.updateClippingPlanes) {
        this.updateClippingPlanes();
      }
    };
    this.add(this.frame);
    this.set(options);
  }
  ////////////
  //  UPDATE
  ////////////
  parseParams() {
    const bestFit = this.getBestFit();
    if (bestFit != "none" && this.childrenTexts.length) {
      this.calculateBestFit(bestFit);
    } else {
      this.childrenTexts.forEach((child) => {
        child._fitFontSize = void 0;
      });
    }
  }
  updateLayout() {
    const WIDTH = this.getWidth();
    const HEIGHT = this.getHeight();
    if (!WIDTH || !HEIGHT) {
      console.warn("Block got no dimension from its parameters or from children parameters");
      return;
    }
    this.size.set(WIDTH, HEIGHT);
    this.frame.scale.set(WIDTH, HEIGHT, 1);
    if (this.frame) this.updateBackgroundMaterial();
    this.frame.renderOrder = this.getParentsNumber();
    if (this.autoLayout) {
      this.setPosFromParentRecords();
    }
    if (this.childrenInlines.length) {
      this.computeInlinesPosition();
    }
    this.computeChildrenPosition();
    if (this.parentUI) {
      this.position.z = this.getOffset();
    }
  }
  //
  updateInner() {
    if (this.parentUI) {
      this.position.z = this.getOffset();
    }
    if (this.frame) this.updateBackgroundMaterial();
  }
};
function InlineComponent(Base) {
  return class InlineComponent extends Base {
    constructor(options) {
      super(options);
      this.isInline = true;
    }
  };
}
function mergeBufferGeometries(geometries, useGroups = false) {
  const isIndexed = geometries[0].index !== null;
  const attributesUsed = new Set(Object.keys(geometries[0].attributes));
  const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));
  const attributes = {};
  const morphAttributes = {};
  const morphTargetsRelative = geometries[0].morphTargetsRelative;
  const mergedGeometry = new external_three_namespaceObject.BufferGeometry();
  let offset = 0;
  for (let i = 0; i < geometries.length; ++i) {
    const geometry = geometries[i];
    let attributesCount = 0;
    if (isIndexed !== (geometry.index !== null)) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");
      return null;
    }
    for (const name in geometry.attributes) {
      if (!attributesUsed.has(name)) {
        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.');
        return null;
      }
      if (attributes[name] === void 0) attributes[name] = [];
      attributes[name].push(geometry.attributes[name]);
      attributesCount++;
    }
    if (attributesCount !== attributesUsed.size) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". Make sure all geometries have the same number of attributes.");
      return null;
    }
    if (morphTargetsRelative !== geometry.morphTargetsRelative) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". .morphTargetsRelative must be consistent throughout all geometries.");
      return null;
    }
    for (const name in geometry.morphAttributes) {
      if (!morphAttributesUsed.has(name)) {
        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ".  .morphAttributes must be consistent throughout all geometries.");
        return null;
      }
      if (morphAttributes[name] === void 0) morphAttributes[name] = [];
      morphAttributes[name].push(geometry.morphAttributes[name]);
    }
    mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || [];
    mergedGeometry.userData.mergedUserData.push(geometry.userData);
    if (useGroups) {
      let count;
      if (isIndexed) {
        count = geometry.index.count;
      } else if (geometry.attributes.position !== void 0) {
        count = geometry.attributes.position.count;
      } else {
        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " + i + ". The geometry must have either an index or a position attribute");
        return null;
      }
      mergedGeometry.addGroup(offset, count, i);
      offset += count;
    }
  }
  if (isIndexed) {
    let indexOffset = 0;
    const mergedIndex = [];
    for (let i = 0; i < geometries.length; ++i) {
      const index = geometries[i].index;
      for (let j = 0; j < index.count; ++j) {
        mergedIndex.push(index.getX(j) + indexOffset);
      }
      indexOffset += geometries[i].attributes.position.count;
    }
    mergedGeometry.setIndex(mergedIndex);
  }
  for (const name in attributes) {
    const mergedAttribute = mergeBufferAttributes(attributes[name]);
    if (!mergedAttribute) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " + name + " attribute.");
      return null;
    }
    mergedGeometry.setAttribute(name, mergedAttribute);
  }
  for (const name in morphAttributes) {
    const numMorphTargets = morphAttributes[name][0].length;
    if (numMorphTargets === 0) break;
    mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
    mergedGeometry.morphAttributes[name] = [];
    for (let i = 0; i < numMorphTargets; ++i) {
      const morphAttributesToMerge = [];
      for (let j = 0; j < morphAttributes[name].length; ++j) {
        morphAttributesToMerge.push(morphAttributes[name][j][i]);
      }
      const mergedMorphAttribute = mergeBufferAttributes(morphAttributesToMerge);
      if (!mergedMorphAttribute) {
        console.error("THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " + name + " morphAttribute.");
        return null;
      }
      mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
    }
  }
  return mergedGeometry;
}
function mergeBufferAttributes(attributes) {
  let TypedArray;
  let itemSize;
  let normalized;
  let arrayLength = 0;
  for (let i = 0; i < attributes.length; ++i) {
    const attribute = attributes[i];
    if (attribute.isInterleavedBufferAttribute) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.");
      return null;
    }
    if (TypedArray === void 0) TypedArray = attribute.array.constructor;
    if (TypedArray !== attribute.array.constructor) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.");
      return null;
    }
    if (itemSize === void 0) itemSize = attribute.itemSize;
    if (itemSize !== attribute.itemSize) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.");
      return null;
    }
    if (normalized === void 0) normalized = attribute.normalized;
    if (normalized !== attribute.normalized) {
      console.error("THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.");
      return null;
    }
    arrayLength += attribute.array.length;
  }
  const array = new TypedArray(arrayLength);
  let offset = 0;
  for (let i = 0; i < attributes.length; ++i) {
    array.set(attributes[i].array, offset);
    offset += attributes[i].array.length;
  }
  return new external_three_namespaceObject.BufferAttribute(array, itemSize, normalized);
}
var MSDFGlyph = class extends external_three_namespaceObject.PlaneGeometry {
  constructor(inline, font) {
    const char = inline.glyph;
    const fontSize = inline.fontSize;
    super(inline.width, inline.height);
    if (char.match(/\s/g) === null) {
      if (font.info.charset.indexOf(char) === -1) console.error(`The character '${char}' is not included in the font characters set.`);
      this.mapUVs(font, char);
      this.transformGeometry(inline);
    } else {
      this.nullifyUVs();
      this.scale(0, 0, 1);
      this.translate(0, fontSize / 2, 0);
    }
  }
  /**
   * Compute the right UVs that will map the MSDF texture so that the passed character
   * will appear centered in full size
   * @private
   */
  mapUVs(font, char) {
    const charOBJ = font.chars.find((charOBJ2) => charOBJ2.char === char);
    const common = font.common;
    const xMin = charOBJ.x / common.scaleW;
    const xMax = (charOBJ.x + charOBJ.width) / common.scaleW;
    const yMin = 1 - (charOBJ.y + charOBJ.height) / common.scaleH;
    const yMax = 1 - charOBJ.y / common.scaleH;
    const uvAttribute = this.attributes.uv;
    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);
      [u, v] = (() => {
        switch (i) {
          case 0:
            return [xMin, yMax];
          case 1:
            return [xMax, yMax];
          case 2:
            return [xMin, yMin];
          case 3:
            return [xMax, yMin];
        }
      })();
      uvAttribute.setXY(i, u, v);
    }
  }
  /** Set all UVs to 0, so that none of the glyphs on the texture will appear */
  nullifyUVs() {
    const uvAttribute = this.attributes.uv;
    for (let i = 0; i < uvAttribute.count; i++) {
      uvAttribute.setXY(i, 0, 0);
    }
  }
  /** Gives the previously computed scale and offset to the geometry */
  transformGeometry(inline) {
    this.translate(
      inline.width / 2,
      inline.height / 2,
      0
    );
  }
};
function getGlyphDimensions(options) {
  const FONT = options.font;
  const FONT_SIZE = options.fontSize;
  const GLYPH = options.glyph;
  const SCALE_MULT = FONT_SIZE / FONT.info.size;
  const charOBJ = FONT.chars.find((charOBJ2) => charOBJ2.char === GLYPH);
  let width = charOBJ ? charOBJ.width * SCALE_MULT : FONT_SIZE / 3;
  let height = charOBJ ? charOBJ.height * SCALE_MULT : 0;
  if (width === 0) {
    width = charOBJ ? charOBJ.xadvance * SCALE_MULT : FONT_SIZE;
  }
  if (height === 0) height = FONT_SIZE * 0.7;
  if (GLYPH === "\n") width = 0;
  const xadvance = charOBJ ? charOBJ.xadvance * SCALE_MULT : width;
  const xoffset = charOBJ ? charOBJ.xoffset * SCALE_MULT : 0;
  const anchor = charOBJ ? charOBJ.yoffset * SCALE_MULT : 0;
  return {
    // lineHeight,
    width,
    height,
    anchor,
    xadvance,
    xoffset
  };
}
function getGlyphPairKerning(font, glyphPair) {
  const KERNINGS = font._kernings;
  return KERNINGS[glyphPair] ? KERNINGS[glyphPair] : 0;
}
function buildText() {
  const translatedGeom = [];
  this.inlines.forEach((inline, i) => {
    translatedGeom[i] = new MSDFGlyph(inline, this.getFontFamily());
    translatedGeom[i].translate(inline.offsetX, inline.offsetY, 0);
  });
  const mergedGeom = mergeBufferGeometries(translatedGeom);
  const mesh = new external_three_namespaceObject.Mesh(mergedGeom, this.getFontMaterial());
  return mesh;
}
var MSDFText = {
  getGlyphDimensions,
  getGlyphPairKerning,
  buildText
};
function TextManager(Base) {
  return class TextManager extends Base {
    createText() {
      const component = this;
      const mesh = (() => {
        switch (this.getTextType()) {
          case "MSDF":
            return MSDFText.buildText.call(this);
          default:
            console.warn(`'${this.getTextType()}' is not a supported text type.
See https://github.com/felixmariotto/three-mesh-ui/wiki/Using-a-custom-text-type`);
            break;
        }
      })();
      mesh.renderOrder = Infinity;
      mesh.onBeforeRender = function() {
        if (component.updateClippingPlanes) {
          component.updateClippingPlanes();
        }
      };
      return mesh;
    }
    /**
     * Called by Text to get the dimensions of a particular glyph,
     * in order for InlineManager to compute its position
     */
    getGlyphDimensions(options) {
      switch (options.textType) {
        case "MSDF":
          return MSDFText.getGlyphDimensions(options);
        default:
          console.warn(`'${options.textType}' is not a supported text type.
See https://github.com/felixmariotto/three-mesh-ui/wiki/Using-a-custom-text-type`);
          break;
      }
    }
    /**
     * Called by Text to get the amount of kerning for pair of glyph
     * @param textType
     * @param font
     * @param glyphPair
     * @returns {number}
     */
    getGlyphPairKerning(textType, font, glyphPair) {
      switch (textType) {
        case "MSDF":
          return MSDFText.getGlyphPairKerning(font, glyphPair);
        default:
          console.warn(`'${textType}' is not a supported text type.
See https://github.com/felixmariotto/three-mesh-ui/wiki/Using-a-custom-text-type`);
          break;
      }
    }
  };
}
function deepDelete(object3D) {
  object3D.children.forEach((child) => {
    if (child.children.length > 0) deepDelete(child);
    object3D.remove(child);
    UpdateManager.disposeOf(child);
    if (child.material) child.material.dispose();
    if (child.geometry) child.geometry.dispose();
  });
  object3D.children = [];
}
var utils_deepDelete = deepDelete;
var Text = class extends mix.withBase(external_three_namespaceObject.Object3D)(
  InlineComponent,
  TextManager,
  MaterialManager,
  MeshUIComponent
) {
  constructor(options) {
    super(options);
    this.isText = true;
    this.set(options);
  }
  ///////////
  // UPDATES
  ///////////
  /**
   * Here we compute each glyph dimension, and we store it in this
   * component's inlines parameter. This way the parent Block will
   * compute each glyph position on updateLayout.
   */
  parseParams() {
    this.calculateInlines(this._fitFontSize || this.getFontSize());
  }
  /**
   * Create text content
   *
   * At this point, text.inlines should have been modified by the parent
   * component, to add xOffset and yOffset properties to each inlines.
   * This way, TextContent knows were to position each character.
   */
  updateLayout() {
    utils_deepDelete(this);
    if (this.inlines) {
      this.textContent = this.createText();
      this.updateTextMaterial();
      this.add(this.textContent);
    }
    this.position.z = this.getOffset();
  }
  updateInner() {
    this.position.z = this.getOffset();
    if (this.textContent) this.updateTextMaterial();
  }
  calculateInlines(fontSize) {
    const content = this.content;
    const font = this.getFontFamily();
    const breakChars = this.getBreakOn();
    const textType = this.getTextType();
    const whiteSpace = this.getWhiteSpace();
    if (!font || typeof font === "string") {
      if (!core_FontLibrary.getFontOf(this)) console.warn("no font was found");
      return;
    }
    if (!this.content) {
      this.inlines = null;
      return;
    }
    if (!textType) {
      console.error(`You must provide a 'textType' attribute so three-mesh-ui knows how to render your text.
 See https://github.com/felixmariotto/three-mesh-ui/wiki/Using-a-custom-text-type`);
      return;
    }
    const whitespaceProcessedContent = collapseWhitespaceOnString(content, whiteSpace);
    const chars = Array.from ? Array.from(whitespaceProcessedContent) : String(whitespaceProcessedContent).split("");
    const SCALE_MULT = fontSize / font.info.size;
    const lineHeight = font.common.lineHeight * SCALE_MULT;
    const lineBase = font.common.base * SCALE_MULT;
    const glyphInfos = chars.map((glyph) => {
      const dimensions = this.getGlyphDimensions({
        textType,
        glyph,
        font,
        fontSize
      });
      let lineBreak = null;
      if (whiteSpace !== NOWRAP) {
        if (breakChars.includes(glyph) || glyph.match(/\s/g)) lineBreak = "possible";
      }
      if (glyph.match(/\n/g)) {
        lineBreak = newlineBreakability(whiteSpace);
      }
      return {
        height: dimensions.height,
        width: dimensions.width,
        anchor: dimensions.anchor,
        xadvance: dimensions.xadvance,
        xoffset: dimensions.xoffset,
        lineBreak,
        glyph,
        fontSize,
        lineHeight,
        lineBase
      };
    });
    if (this.getFontKerning() !== "none") {
      for (let i = 1; i < glyphInfos.length; i++) {
        const glyphInfo = glyphInfos[i];
        const glyphPair = glyphInfos[i - 1].glyph + glyphInfos[i].glyph;
        const kerning = this.getGlyphPairKerning(textType, font, glyphPair);
        glyphInfo["kerning"] = kerning * (fontSize / font.info.size);
      }
    }
    this.inlines = glyphInfos;
  }
};
var InlineBlock = class extends mix.withBase(external_three_namespaceObject.Object3D)(
  InlineComponent,
  BoxComponent,
  InlineManager,
  MaterialManager,
  MeshUIComponent
) {
  constructor(options) {
    super(options);
    this.isInlineBlock = true;
    this.size = new external_three_namespaceObject.Vector2(1, 1);
    this.frame = new Frame(this.getBackgroundMaterial());
    this.frame.onBeforeRender = () => {
      if (this.updateClippingPlanes) {
        this.updateClippingPlanes();
      }
    };
    this.add(this.frame);
    this.set(options);
  }
  ///////////
  // UPDATES
  ///////////
  parseParams() {
    if (!this.width) console.warn("inlineBlock has no width. Set to 0.3 by default");
    if (!this.height) console.warn("inlineBlock has no height. Set to 0.3 by default");
    this.inlines = [{
      height: this.height || 0.3,
      width: this.width || 0.3,
      anchor: 0,
      lineBreak: "possible"
    }];
  }
  //
  /**
   * Create text content
   *
   * At this point, text.inlines should have been modified by the parent
   * component, to add xOffset and yOffset properties to each inlines.
   * This way, TextContent knows were to position each character.
   *
   */
  updateLayout() {
    const WIDTH = this.getWidth();
    const HEIGHT = this.getHeight();
    if (this.inlines) {
      const options = this.inlines[0];
      this.position.set(options.width / 2, options.height / 2, 0);
      this.position.x += options.offsetX;
      this.position.y += options.offsetY;
    }
    this.size.set(WIDTH, HEIGHT);
    this.frame.scale.set(WIDTH, HEIGHT, 1);
    if (this.frame) this.updateBackgroundMaterial();
    this.frame.renderOrder = this.getParentsNumber();
    if (this.childrenInlines.length) {
      this.computeInlinesPosition();
    }
    this.computeChildrenPosition();
    this.position.z = this.getOffset();
  }
  //
  updateInner() {
    this.position.z = this.getOffset();
    if (this.frame) this.updateBackgroundMaterial();
  }
};
var Keymaps = {
  fr: [
    [
      [
        { width: 0.1, chars: [{ lowerCase: "a", upperCase: "A" }] },
        { width: 0.1, chars: [{ lowerCase: "z", upperCase: "Z" }] },
        { width: 0.1, chars: [{ lowerCase: "e", upperCase: "E" }] },
        { width: 0.1, chars: [{ lowerCase: "r", upperCase: "R" }] },
        { width: 0.1, chars: [{ lowerCase: "t", upperCase: "T" }] },
        { width: 0.1, chars: [{ lowerCase: "y", upperCase: "Y" }] },
        { width: 0.1, chars: [{ lowerCase: "u", upperCase: "U" }] },
        { width: 0.1, chars: [{ lowerCase: "i", upperCase: "I" }] },
        { width: 0.1, chars: [{ lowerCase: "o", upperCase: "O" }] },
        { width: 0.1, chars: [{ lowerCase: "p", upperCase: "P" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "q", upperCase: "Q" }] },
        { width: 0.1, chars: [{ lowerCase: "s", upperCase: "S" }] },
        { width: 0.1, chars: [{ lowerCase: "d", upperCase: "D" }] },
        { width: 0.1, chars: [{ lowerCase: "f", upperCase: "F" }] },
        { width: 0.1, chars: [{ lowerCase: "g", upperCase: "G" }] },
        { width: 0.1, chars: [{ lowerCase: "h", upperCase: "H" }] },
        { width: 0.1, chars: [{ lowerCase: "j", upperCase: "J" }] },
        { width: 0.1, chars: [{ lowerCase: "k", upperCase: "K" }] },
        { width: 0.1, chars: [{ lowerCase: "l", upperCase: "L" }] },
        { width: 0.1, chars: [{ lowerCase: "m", upperCase: "M" }] }
      ],
      [
        { width: 0.2, command: "shift", chars: [{ icon: "shift" }] },
        { width: 0.1, chars: [{ lowerCase: "w", upperCase: "W" }] },
        { width: 0.1, chars: [{ lowerCase: "x", upperCase: "X" }] },
        { width: 0.1, chars: [{ lowerCase: "c", upperCase: "C" }] },
        { width: 0.1, chars: [{ lowerCase: "v", upperCase: "V" }] },
        { width: 0.1, chars: [{ lowerCase: "b", upperCase: "B" }] },
        { width: 0.1, chars: [{ lowerCase: "n", upperCase: "N" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ],
    [
      [
        { width: 0.1, chars: [{ lowerCase: "1" }] },
        { width: 0.1, chars: [{ lowerCase: "2" }] },
        { width: 0.1, chars: [{ lowerCase: "3" }] },
        { width: 0.1, chars: [{ lowerCase: "4" }] },
        { width: 0.1, chars: [{ lowerCase: "5" }] },
        { width: 0.1, chars: [{ lowerCase: "6" }] },
        { width: 0.1, chars: [{ lowerCase: "7" }] },
        { width: 0.1, chars: [{ lowerCase: "8" }] },
        { width: 0.1, chars: [{ lowerCase: "9" }] },
        { width: 0.1, chars: [{ lowerCase: "0" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "@" }] },
        { width: 0.1, chars: [{ lowerCase: "#" }] },
        { width: 0.1, chars: [{ lowerCase: "|" }] },
        { width: 0.1, chars: [{ lowerCase: "_" }] },
        { width: 0.1, chars: [{ lowerCase: "&" }] },
        { width: 0.1, chars: [{ lowerCase: "-" }] },
        { width: 0.1, chars: [{ lowerCase: "+" }] },
        { width: 0.1, chars: [{ lowerCase: "(" }] },
        { width: 0.1, chars: [{ lowerCase: ")" }] },
        { width: 0.1, chars: [{ lowerCase: "/" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "=" }] },
        { width: 0.1, chars: [{ lowerCase: "*" }] },
        { width: 0.1, chars: [{ lowerCase: '"' }] },
        { width: 0.1, chars: [{ lowerCase: "'" }] },
        { width: 0.1, chars: [{ lowerCase: ":" }] },
        { width: 0.1, chars: [{ lowerCase: ";" }] },
        { width: 0.1, chars: [{ lowerCase: "!" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ]
  ],
  ///////////////////////////////////////////////////////////
  eng: [
    [
      [
        { width: 0.1, chars: [{ lowerCase: "q", upperCase: "Q" }] },
        { width: 0.1, chars: [{ lowerCase: "w", upperCase: "W" }] },
        { width: 0.1, chars: [{ lowerCase: "e", upperCase: "E" }] },
        { width: 0.1, chars: [{ lowerCase: "r", upperCase: "R" }] },
        { width: 0.1, chars: [{ lowerCase: "t", upperCase: "T" }] },
        { width: 0.1, chars: [{ lowerCase: "y", upperCase: "Y" }] },
        { width: 0.1, chars: [{ lowerCase: "u", upperCase: "U" }] },
        { width: 0.1, chars: [{ lowerCase: "i", upperCase: "I" }] },
        { width: 0.1, chars: [{ lowerCase: "o", upperCase: "O" }] },
        { width: 0.1, chars: [{ lowerCase: "p", upperCase: "P" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "a", upperCase: "A" }] },
        { width: 0.1, chars: [{ lowerCase: "s", upperCase: "S" }] },
        { width: 0.1, chars: [{ lowerCase: "d", upperCase: "D" }] },
        { width: 0.1, chars: [{ lowerCase: "f", upperCase: "F" }] },
        { width: 0.1, chars: [{ lowerCase: "g", upperCase: "G" }] },
        { width: 0.1, chars: [{ lowerCase: "h", upperCase: "H" }] },
        { width: 0.1, chars: [{ lowerCase: "j", upperCase: "J" }] },
        { width: 0.1, chars: [{ lowerCase: "k", upperCase: "K" }] },
        { width: 0.1, chars: [{ lowerCase: "l", upperCase: "L" }] }
      ],
      [
        { width: 0.15, command: "shift", chars: [{ icon: "shift" }] },
        { width: 0.1, chars: [{ lowerCase: "z", upperCase: "Z" }] },
        { width: 0.1, chars: [{ lowerCase: "x", upperCase: "X" }] },
        { width: 0.1, chars: [{ lowerCase: "c", upperCase: "C" }] },
        { width: 0.1, chars: [{ lowerCase: "v", upperCase: "V" }] },
        { width: 0.1, chars: [{ lowerCase: "b", upperCase: "B" }] },
        { width: 0.1, chars: [{ lowerCase: "n", upperCase: "N" }] },
        { width: 0.1, chars: [{ lowerCase: "m", upperCase: "M" }] },
        { width: 0.15, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ],
    [
      [
        { width: 0.1, chars: [{ lowerCase: "1" }] },
        { width: 0.1, chars: [{ lowerCase: "2" }] },
        { width: 0.1, chars: [{ lowerCase: "3" }] },
        { width: 0.1, chars: [{ lowerCase: "4" }] },
        { width: 0.1, chars: [{ lowerCase: "5" }] },
        { width: 0.1, chars: [{ lowerCase: "6" }] },
        { width: 0.1, chars: [{ lowerCase: "7" }] },
        { width: 0.1, chars: [{ lowerCase: "8" }] },
        { width: 0.1, chars: [{ lowerCase: "9" }] },
        { width: 0.1, chars: [{ lowerCase: "0" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "@" }] },
        { width: 0.1, chars: [{ lowerCase: "#" }] },
        { width: 0.1, chars: [{ lowerCase: "|" }] },
        { width: 0.1, chars: [{ lowerCase: "_" }] },
        { width: 0.1, chars: [{ lowerCase: "&" }] },
        { width: 0.1, chars: [{ lowerCase: "-" }] },
        { width: 0.1, chars: [{ lowerCase: "+" }] },
        { width: 0.1, chars: [{ lowerCase: "(" }] },
        { width: 0.1, chars: [{ lowerCase: ")" }] },
        { width: 0.1, chars: [{ lowerCase: "/" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "=" }] },
        { width: 0.1, chars: [{ lowerCase: "*" }] },
        { width: 0.1, chars: [{ lowerCase: '"' }] },
        { width: 0.1, chars: [{ lowerCase: "'" }] },
        { width: 0.1, chars: [{ lowerCase: ":" }] },
        { width: 0.1, chars: [{ lowerCase: ";" }] },
        { width: 0.1, chars: [{ lowerCase: "!" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ]
  ],
  ////////////////////////////////////////////////////////////
  ru: [
    [
      [
        { width: 1 / 12, chars: [{ lowerCase: "й", upperCase: "Й" }, { lowerCase: "q", upperCase: "Q" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ц", upperCase: "Ц" }, { lowerCase: "w", upperCase: "W" }] },
        { width: 1 / 12, chars: [{ lowerCase: "у", upperCase: "У" }, { lowerCase: "e", upperCase: "E" }] },
        { width: 1 / 12, chars: [{ lowerCase: "к", upperCase: "К" }, { lowerCase: "r", upperCase: "R" }] },
        { width: 1 / 12, chars: [{ lowerCase: "е", upperCase: "Е" }, { lowerCase: "t", upperCase: "T" }] },
        { width: 1 / 12, chars: [{ lowerCase: "н", upperCase: "Н" }, { lowerCase: "y", upperCase: "Y" }] },
        { width: 1 / 12, chars: [{ lowerCase: "г", upperCase: "Г" }, { lowerCase: "u", upperCase: "U" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ш", upperCase: "Ш" }, { lowerCase: "i", upperCase: "I" }] },
        { width: 1 / 12, chars: [{ lowerCase: "щ", upperCase: "Щ" }, { lowerCase: "o", upperCase: "O" }] },
        { width: 1 / 12, chars: [{ lowerCase: "з", upperCase: "З" }, { lowerCase: "p", upperCase: "P" }] },
        { width: 1 / 12, chars: [{ lowerCase: "х", upperCase: "Х" }, { lowerCase: "{", upperCase: "[" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ъ", upperCase: "Ъ" }, { lowerCase: "}", upperCase: "]" }] }
      ],
      [
        { width: 1 / 12, chars: [{ lowerCase: "ф", upperCase: "Ф" }, { lowerCase: "a", upperCase: "A" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ы", upperCase: "Ы" }, { lowerCase: "s", upperCase: "S" }] },
        { width: 1 / 12, chars: [{ lowerCase: "в", upperCase: "В" }, { lowerCase: "d", upperCase: "D" }] },
        { width: 1 / 12, chars: [{ lowerCase: "а", upperCase: "А" }, { lowerCase: "f", upperCase: "F" }] },
        { width: 1 / 12, chars: [{ lowerCase: "п", upperCase: "П" }, { lowerCase: "g", upperCase: "G" }] },
        { width: 1 / 12, chars: [{ lowerCase: "р", upperCase: "Р" }, { lowerCase: "h", upperCase: "H" }] },
        { width: 1 / 12, chars: [{ lowerCase: "о", upperCase: "О" }, { lowerCase: "j", upperCase: "J" }] },
        { width: 1 / 12, chars: [{ lowerCase: "л", upperCase: "Л" }, { lowerCase: "k", upperCase: "K" }] },
        { width: 1 / 12, chars: [{ lowerCase: "д", upperCase: "Д" }, { lowerCase: "l", upperCase: "L" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ж", upperCase: "Ж" }, { lowerCase: ":", upperCase: ";" }] },
        { width: 1 / 12, chars: [{ lowerCase: "э", upperCase: "Э" }, { lowerCase: '"', upperCase: "'" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ё", upperCase: "Ё" }, { lowerCase: "|", upperCase: "\\" }] }
      ],
      [
        { width: 1.5 / 12, command: "shift", chars: [{ icon: "shift" }] },
        { width: 1 / 12, chars: [{ lowerCase: "я", upperCase: "Я" }, { lowerCase: "z", upperCase: "Z" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ч", upperCase: "Ч" }, { lowerCase: "x", upperCase: "X" }] },
        { width: 1 / 12, chars: [{ lowerCase: "с", upperCase: "С" }, { lowerCase: "c", upperCase: "C" }] },
        { width: 1 / 12, chars: [{ lowerCase: "м", upperCase: "М" }, { lowerCase: "v", upperCase: "V" }] },
        { width: 1 / 12, chars: [{ lowerCase: "и", upperCase: "И" }, { lowerCase: "b", upperCase: "B" }] },
        { width: 1 / 12, chars: [{ lowerCase: "т", upperCase: "Т" }, { lowerCase: "n", upperCase: "N" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ь", upperCase: "Ь" }, { lowerCase: "m", upperCase: "M" }] },
        { width: 1 / 12, chars: [{ lowerCase: "б", upperCase: "Б" }, { lowerCase: ",", upperCase: "" }] },
        { width: 1 / 12, chars: [{ lowerCase: "ю", upperCase: "Ю" }, { lowerCase: ".", upperCase: "" }] },
        { width: 1.5 / 12, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.15, command: "switch-set", chars: [{ lowerCase: "eng" }] },
        { width: 0.15, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ],
    [
      [
        { width: 0.1, chars: [{ lowerCase: "1" }] },
        { width: 0.1, chars: [{ lowerCase: "2" }] },
        { width: 0.1, chars: [{ lowerCase: "3" }] },
        { width: 0.1, chars: [{ lowerCase: "4" }] },
        { width: 0.1, chars: [{ lowerCase: "5" }] },
        { width: 0.1, chars: [{ lowerCase: "6" }] },
        { width: 0.1, chars: [{ lowerCase: "7" }] },
        { width: 0.1, chars: [{ lowerCase: "8" }] },
        { width: 0.1, chars: [{ lowerCase: "9" }] },
        { width: 0.1, chars: [{ lowerCase: "0" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "@" }] },
        { width: 0.1, chars: [{ lowerCase: "#" }] },
        { width: 0.1, chars: [{ lowerCase: "|" }] },
        { width: 0.1, chars: [{ lowerCase: "_" }] },
        { width: 0.1, chars: [{ lowerCase: "&" }] },
        { width: 0.1, chars: [{ lowerCase: "-" }] },
        { width: 0.1, chars: [{ lowerCase: "+" }] },
        { width: 0.1, chars: [{ lowerCase: "(" }] },
        { width: 0.1, chars: [{ lowerCase: ")" }] },
        { width: 0.1, chars: [{ lowerCase: "/" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "=" }] },
        { width: 0.1, chars: [{ lowerCase: "*" }] },
        { width: 0.1, chars: [{ lowerCase: '"' }] },
        { width: 0.1, chars: [{ lowerCase: "'" }] },
        { width: 0.1, chars: [{ lowerCase: ":" }] },
        { width: 0.1, chars: [{ lowerCase: ";" }] },
        { width: 0.1, chars: [{ lowerCase: "!" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.3, command: "switch", chars: [{ lowerCase: "АБВ" }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ]
  ],
  /////////////////////////////////////////////////////////
  de: [
    [
      [
        { width: 1 / 11, chars: [{ lowerCase: "q", upperCase: "Q" }] },
        { width: 1 / 11, chars: [{ lowerCase: "w", upperCase: "W" }] },
        { width: 1 / 11, chars: [{ lowerCase: "e", upperCase: "E" }] },
        { width: 1 / 11, chars: [{ lowerCase: "r", upperCase: "R" }] },
        { width: 1 / 11, chars: [{ lowerCase: "t", upperCase: "T" }] },
        { width: 1 / 11, chars: [{ lowerCase: "z", upperCase: "Z" }] },
        { width: 1 / 11, chars: [{ lowerCase: "u", upperCase: "U" }] },
        { width: 1 / 11, chars: [{ lowerCase: "i", upperCase: "I" }] },
        { width: 1 / 11, chars: [{ lowerCase: "o", upperCase: "O" }] },
        { width: 1 / 11, chars: [{ lowerCase: "p", upperCase: "P" }] },
        { width: 1 / 11, chars: [{ lowerCase: "ü", upperCase: "Ü" }] }
      ],
      [
        { width: 1 / 11, chars: [{ lowerCase: "a", upperCase: "A" }] },
        { width: 1 / 11, chars: [{ lowerCase: "s", upperCase: "S" }] },
        { width: 1 / 11, chars: [{ lowerCase: "d", upperCase: "D" }] },
        { width: 1 / 11, chars: [{ lowerCase: "f", upperCase: "F" }] },
        { width: 1 / 11, chars: [{ lowerCase: "g", upperCase: "G" }] },
        { width: 1 / 11, chars: [{ lowerCase: "h", upperCase: "H" }] },
        { width: 1 / 11, chars: [{ lowerCase: "j", upperCase: "J" }] },
        { width: 1 / 11, chars: [{ lowerCase: "k", upperCase: "K" }] },
        { width: 1 / 11, chars: [{ lowerCase: "l", upperCase: "L" }] },
        { width: 1 / 11, chars: [{ lowerCase: "ö", upperCase: "Ö" }] },
        { width: 1 / 11, chars: [{ lowerCase: "ä", upperCase: "Ä" }] }
      ],
      [
        { width: 2 / 11, command: "shift", chars: [{ icon: "shift" }] },
        { width: 1 / 11, chars: [{ lowerCase: "y", upperCase: "Y" }] },
        { width: 1 / 11, chars: [{ lowerCase: "x", upperCase: "X" }] },
        { width: 1 / 11, chars: [{ lowerCase: "c", upperCase: "C" }] },
        { width: 1 / 11, chars: [{ lowerCase: "v", upperCase: "V" }] },
        { width: 1 / 11, chars: [{ lowerCase: "b", upperCase: "B" }] },
        { width: 1 / 11, chars: [{ lowerCase: "n", upperCase: "N" }] },
        { width: 1 / 11, chars: [{ lowerCase: "m", upperCase: "M" }] },
        { width: 2 / 11, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ],
    [
      [
        { width: 0.1, chars: [{ lowerCase: "1" }] },
        { width: 0.1, chars: [{ lowerCase: "2" }] },
        { width: 0.1, chars: [{ lowerCase: "3" }] },
        { width: 0.1, chars: [{ lowerCase: "4" }] },
        { width: 0.1, chars: [{ lowerCase: "5" }] },
        { width: 0.1, chars: [{ lowerCase: "6" }] },
        { width: 0.1, chars: [{ lowerCase: "7" }] },
        { width: 0.1, chars: [{ lowerCase: "8" }] },
        { width: 0.1, chars: [{ lowerCase: "9" }] },
        { width: 0.1, chars: [{ lowerCase: "0" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "@" }] },
        { width: 0.1, chars: [{ lowerCase: "#" }] },
        { width: 0.1, chars: [{ lowerCase: "|" }] },
        { width: 0.1, chars: [{ lowerCase: "_" }] },
        { width: 0.1, chars: [{ lowerCase: "&" }] },
        { width: 0.1, chars: [{ lowerCase: "-" }] },
        { width: 0.1, chars: [{ lowerCase: "+" }] },
        { width: 0.1, chars: [{ lowerCase: "(" }] },
        { width: 0.1, chars: [{ lowerCase: ")" }] },
        { width: 0.1, chars: [{ lowerCase: "/" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "=" }] },
        { width: 0.1, chars: [{ lowerCase: "*" }] },
        { width: 0.1, chars: [{ lowerCase: '"' }] },
        { width: 0.1, chars: [{ lowerCase: "'" }] },
        { width: 0.1, chars: [{ lowerCase: ":" }] },
        { width: 0.1, chars: [{ lowerCase: ";" }] },
        { width: 0.1, chars: [{ lowerCase: "!" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ]
  ],
  ///////////////////////////////////////////////////////////
  es: [
    [
      [
        { width: 0.1, chars: [{ lowerCase: "q", upperCase: "Q" }] },
        { width: 0.1, chars: [{ lowerCase: "w", upperCase: "W" }] },
        { width: 0.1, chars: [{ lowerCase: "e", upperCase: "E" }] },
        { width: 0.1, chars: [{ lowerCase: "r", upperCase: "R" }] },
        { width: 0.1, chars: [{ lowerCase: "t", upperCase: "T" }] },
        { width: 0.1, chars: [{ lowerCase: "y", upperCase: "Y" }] },
        { width: 0.1, chars: [{ lowerCase: "u", upperCase: "U" }] },
        { width: 0.1, chars: [{ lowerCase: "i", upperCase: "I" }] },
        { width: 0.1, chars: [{ lowerCase: "o", upperCase: "O" }] },
        { width: 0.1, chars: [{ lowerCase: "p", upperCase: "P" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "a", upperCase: "A" }] },
        { width: 0.1, chars: [{ lowerCase: "s", upperCase: "S" }] },
        { width: 0.1, chars: [{ lowerCase: "d", upperCase: "D" }] },
        { width: 0.1, chars: [{ lowerCase: "f", upperCase: "F" }] },
        { width: 0.1, chars: [{ lowerCase: "g", upperCase: "G" }] },
        { width: 0.1, chars: [{ lowerCase: "h", upperCase: "H" }] },
        { width: 0.1, chars: [{ lowerCase: "j", upperCase: "J" }] },
        { width: 0.1, chars: [{ lowerCase: "k", upperCase: "K" }] },
        { width: 0.1, chars: [{ lowerCase: "l", upperCase: "L" }] },
        { width: 0.1, chars: [{ lowerCase: "ñ", upperCase: "Ñ" }] }
      ],
      [
        { width: 0.15, command: "shift", chars: [{ icon: "shift" }] },
        { width: 0.1, chars: [{ lowerCase: "z", upperCase: "Z" }] },
        { width: 0.1, chars: [{ lowerCase: "x", upperCase: "X" }] },
        { width: 0.1, chars: [{ lowerCase: "c", upperCase: "C" }] },
        { width: 0.1, chars: [{ lowerCase: "v", upperCase: "V" }] },
        { width: 0.1, chars: [{ lowerCase: "b", upperCase: "B" }] },
        { width: 0.1, chars: [{ lowerCase: "n", upperCase: "N" }] },
        { width: 0.1, chars: [{ lowerCase: "m", upperCase: "M" }] },
        { width: 0.15, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ],
    [
      [
        { width: 0.1, chars: [{ lowerCase: "1" }] },
        { width: 0.1, chars: [{ lowerCase: "2" }] },
        { width: 0.1, chars: [{ lowerCase: "3" }] },
        { width: 0.1, chars: [{ lowerCase: "4" }] },
        { width: 0.1, chars: [{ lowerCase: "5" }] },
        { width: 0.1, chars: [{ lowerCase: "6" }] },
        { width: 0.1, chars: [{ lowerCase: "7" }] },
        { width: 0.1, chars: [{ lowerCase: "8" }] },
        { width: 0.1, chars: [{ lowerCase: "9" }] },
        { width: 0.1, chars: [{ lowerCase: "0" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "@" }] },
        { width: 0.1, chars: [{ lowerCase: "#" }] },
        { width: 0.1, chars: [{ lowerCase: "|" }] },
        { width: 0.1, chars: [{ lowerCase: "_" }] },
        { width: 0.1, chars: [{ lowerCase: "&" }] },
        { width: 0.1, chars: [{ lowerCase: "-" }] },
        { width: 0.1, chars: [{ lowerCase: "+" }] },
        { width: 0.1, chars: [{ lowerCase: "(" }] },
        { width: 0.1, chars: [{ lowerCase: ")" }] },
        { width: 0.1, chars: [{ lowerCase: "/" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "=" }] },
        { width: 0.1, chars: [{ lowerCase: "*" }] },
        { width: 0.1, chars: [{ lowerCase: '"' }] },
        { width: 0.1, chars: [{ lowerCase: "'" }] },
        { width: 0.1, chars: [{ lowerCase: ":" }] },
        { width: 0.1, chars: [{ lowerCase: ";" }] },
        { width: 0.1, chars: [{ lowerCase: "!" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ]
  ],
  //////////////////////////////////////////////////////////////////////
  el: [
    [
      [
        { width: 0.1, chars: [{ lowerCase: ";", upperCase: ":" }, { lowerCase: "q", upperCase: "Q" }] },
        { width: 0.1, chars: [{ lowerCase: "ς", upperCase: "ς" }, { lowerCase: "w", upperCase: "W" }] },
        { width: 0.1, chars: [{ lowerCase: "ε", upperCase: "Ε" }, { lowerCase: "e", upperCase: "E" }] },
        { width: 0.1, chars: [{ lowerCase: "ρ", upperCase: "Ρ" }, { lowerCase: "r", upperCase: "R" }] },
        { width: 0.1, chars: [{ lowerCase: "τ", upperCase: "Τ" }, { lowerCase: "t", upperCase: "T" }] },
        { width: 0.1, chars: [{ lowerCase: "υ", upperCase: "Υ" }, { lowerCase: "y", upperCase: "Y" }] },
        { width: 0.1, chars: [{ lowerCase: "θ", upperCase: "Θ" }, { lowerCase: "u", upperCase: "U" }] },
        { width: 0.1, chars: [{ lowerCase: "ι", upperCase: "Ι" }, { lowerCase: "i", upperCase: "I" }] },
        { width: 0.1, chars: [{ lowerCase: "ο", upperCase: "Ο" }, { lowerCase: "o", upperCase: "O" }] },
        { width: 0.1, chars: [{ lowerCase: "π", upperCase: "Π" }, { lowerCase: "p", upperCase: "P" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "α", upperCase: "Α" }, { lowerCase: "a", upperCase: "A" }] },
        { width: 0.1, chars: [{ lowerCase: "σ", upperCase: "Σ" }, { lowerCase: "s", upperCase: "S" }] },
        { width: 0.1, chars: [{ lowerCase: "δ", upperCase: "Δ" }, { lowerCase: "d", upperCase: "D" }] },
        { width: 0.1, chars: [{ lowerCase: "φ", upperCase: "Φ" }, { lowerCase: "f", upperCase: "F" }] },
        { width: 0.1, chars: [{ lowerCase: "γ", upperCase: "Γ" }, { lowerCase: "g", upperCase: "G" }] },
        { width: 0.1, chars: [{ lowerCase: "η", upperCase: "Η" }, { lowerCase: "h", upperCase: "H" }] },
        { width: 0.1, chars: [{ lowerCase: "ξ", upperCase: "Ξ" }, { lowerCase: "j", upperCase: "J" }] },
        { width: 0.1, chars: [{ lowerCase: "κ", upperCase: "Κ" }, { lowerCase: "k", upperCase: "K" }] },
        { width: 0.1, chars: [{ lowerCase: "λ", upperCase: "Λ" }, { lowerCase: "l", upperCase: "L" }] }
      ],
      [
        { width: 0.15, command: "shift", chars: [{ icon: "shift" }] },
        { width: 0.1, chars: [{ lowerCase: "ζ", upperCase: "Ζ" }, { lowerCase: "z", upperCase: "Z" }] },
        { width: 0.1, chars: [{ lowerCase: "χ", upperCase: "Χ" }, { lowerCase: "x", upperCase: "X" }] },
        { width: 0.1, chars: [{ lowerCase: "ψ", upperCase: "Ψ" }, { lowerCase: "c", upperCase: "C" }] },
        { width: 0.1, chars: [{ lowerCase: "ω", upperCase: "Ω" }, { lowerCase: "v", upperCase: "V" }] },
        { width: 0.1, chars: [{ lowerCase: "β", upperCase: "Β" }, { lowerCase: "b", upperCase: "B" }] },
        { width: 0.1, chars: [{ lowerCase: "ν", upperCase: "Ν" }, { lowerCase: "n", upperCase: "N" }] },
        { width: 0.1, chars: [{ lowerCase: "μ", upperCase: "Μ" }, { lowerCase: "m", upperCase: "M" }] },
        { width: 0.15, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.15, command: "switch-set", chars: [{ lowerCase: "eng" }] },
        { width: 0.15, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ],
    [
      [
        { width: 0.1, chars: [{ lowerCase: "1" }] },
        { width: 0.1, chars: [{ lowerCase: "2" }] },
        { width: 0.1, chars: [{ lowerCase: "3" }] },
        { width: 0.1, chars: [{ lowerCase: "4" }] },
        { width: 0.1, chars: [{ lowerCase: "5" }] },
        { width: 0.1, chars: [{ lowerCase: "6" }] },
        { width: 0.1, chars: [{ lowerCase: "7" }] },
        { width: 0.1, chars: [{ lowerCase: "8" }] },
        { width: 0.1, chars: [{ lowerCase: "9" }] },
        { width: 0.1, chars: [{ lowerCase: "0" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "@" }] },
        { width: 0.1, chars: [{ lowerCase: "#" }] },
        { width: 0.1, chars: [{ lowerCase: "|" }] },
        { width: 0.1, chars: [{ lowerCase: "_" }] },
        { width: 0.1, chars: [{ lowerCase: "&" }] },
        { width: 0.1, chars: [{ lowerCase: "-" }] },
        { width: 0.1, chars: [{ lowerCase: "+" }] },
        { width: 0.1, chars: [{ lowerCase: "(" }] },
        { width: 0.1, chars: [{ lowerCase: ")" }] },
        { width: 0.1, chars: [{ lowerCase: "/" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "=" }] },
        { width: 0.1, chars: [{ lowerCase: "*" }] },
        { width: 0.1, chars: [{ lowerCase: '"' }] },
        { width: 0.1, chars: [{ lowerCase: "'" }] },
        { width: 0.1, chars: [{ lowerCase: ":" }] },
        { width: 0.1, chars: [{ lowerCase: ";" }] },
        { width: 0.1, chars: [{ lowerCase: "!" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ]
  ],
  ////////////////////////////////////////////////////////////////////////////////
  nord: [
    [
      [
        { width: 1 / 11, chars: [{ lowerCase: "q", upperCase: "Q" }] },
        { width: 1 / 11, chars: [{ lowerCase: "w", upperCase: "W" }] },
        { width: 1 / 11, chars: [{ lowerCase: "e", upperCase: "E" }] },
        { width: 1 / 11, chars: [{ lowerCase: "r", upperCase: "R" }] },
        { width: 1 / 11, chars: [{ lowerCase: "t", upperCase: "T" }] },
        { width: 1 / 11, chars: [{ lowerCase: "y", upperCase: "Y" }] },
        { width: 1 / 11, chars: [{ lowerCase: "u", upperCase: "U" }] },
        { width: 1 / 11, chars: [{ lowerCase: "i", upperCase: "I" }] },
        { width: 1 / 11, chars: [{ lowerCase: "o", upperCase: "O" }] },
        { width: 1 / 11, chars: [{ lowerCase: "p", upperCase: "P" }] },
        { width: 1 / 11, chars: [{ lowerCase: "å", upperCase: "Å" }] }
      ],
      [
        { width: 1 / 11, chars: [{ lowerCase: "a", upperCase: "A" }] },
        { width: 1 / 11, chars: [{ lowerCase: "s", upperCase: "S" }] },
        { width: 1 / 11, chars: [{ lowerCase: "d", upperCase: "D" }] },
        { width: 1 / 11, chars: [{ lowerCase: "f", upperCase: "F" }] },
        { width: 1 / 11, chars: [{ lowerCase: "g", upperCase: "G" }] },
        { width: 1 / 11, chars: [{ lowerCase: "h", upperCase: "H" }] },
        { width: 1 / 11, chars: [{ lowerCase: "j", upperCase: "J" }] },
        { width: 1 / 11, chars: [{ lowerCase: "k", upperCase: "K" }] },
        { width: 1 / 11, chars: [{ lowerCase: "l", upperCase: "L" }] },
        { width: 1 / 11, chars: [{ lowerCase: "æ", upperCase: "Æ" }] },
        { width: 1 / 11, chars: [{ lowerCase: "ø", upperCase: "Ø" }] }
      ],
      [
        { width: 2 / 11, command: "shift", chars: [{ icon: "shift" }] },
        { width: 1 / 11, chars: [{ lowerCase: "z", upperCase: "Z" }] },
        { width: 1 / 11, chars: [{ lowerCase: "x", upperCase: "X" }] },
        { width: 1 / 11, chars: [{ lowerCase: "c", upperCase: "C" }] },
        { width: 1 / 11, chars: [{ lowerCase: "v", upperCase: "V" }] },
        { width: 1 / 11, chars: [{ lowerCase: "b", upperCase: "B" }] },
        { width: 1 / 11, chars: [{ lowerCase: "n", upperCase: "N" }] },
        { width: 1 / 11, chars: [{ lowerCase: "m", upperCase: "M" }] },
        { width: 2 / 11, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ],
    [
      [
        { width: 0.1, chars: [{ lowerCase: "1" }] },
        { width: 0.1, chars: [{ lowerCase: "2" }] },
        { width: 0.1, chars: [{ lowerCase: "3" }] },
        { width: 0.1, chars: [{ lowerCase: "4" }] },
        { width: 0.1, chars: [{ lowerCase: "5" }] },
        { width: 0.1, chars: [{ lowerCase: "6" }] },
        { width: 0.1, chars: [{ lowerCase: "7" }] },
        { width: 0.1, chars: [{ lowerCase: "8" }] },
        { width: 0.1, chars: [{ lowerCase: "9" }] },
        { width: 0.1, chars: [{ lowerCase: "0" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "@" }] },
        { width: 0.1, chars: [{ lowerCase: "#" }] },
        { width: 0.1, chars: [{ lowerCase: "|" }] },
        { width: 0.1, chars: [{ lowerCase: "_" }] },
        { width: 0.1, chars: [{ lowerCase: "&" }] },
        { width: 0.1, chars: [{ lowerCase: "-" }] },
        { width: 0.1, chars: [{ lowerCase: "+" }] },
        { width: 0.1, chars: [{ lowerCase: "(" }] },
        { width: 0.1, chars: [{ lowerCase: ")" }] },
        { width: 0.1, chars: [{ lowerCase: "/" }] }
      ],
      [
        { width: 0.1, chars: [{ lowerCase: "=" }] },
        { width: 0.1, chars: [{ lowerCase: "*" }] },
        { width: 0.1, chars: [{ lowerCase: '"' }] },
        { width: 0.1, chars: [{ lowerCase: "'" }] },
        { width: 0.1, chars: [{ lowerCase: ":" }] },
        { width: 0.1, chars: [{ lowerCase: ";" }] },
        { width: 0.1, chars: [{ lowerCase: "!" }] },
        { width: 0.1, chars: [{ lowerCase: "?" }] },
        { width: 0.2, command: "backspace", chars: [{ icon: "backspace" }] }
      ],
      [
        { width: 0.2, command: "switch", chars: [{ lowerCase: ".?12" }] },
        { width: 0.1, chars: [{ lowerCase: "," }] },
        { width: 0.4, command: "space", chars: [{ icon: "space" }] },
        { width: 0.1, chars: [{ lowerCase: "." }] },
        { width: 0.2, command: "enter", chars: [{ icon: "enter" }] }
      ]
    ]
  ]
};
var Keyboard_textureLoader = new external_three_namespaceObject.TextureLoader();
var Keyboard = class extends mix.withBase(external_three_namespaceObject.Object3D)(BoxComponent, MeshUIComponent) {
  constructor(options) {
    if (!options) options = {};
    if (!options.width) options.width = 1;
    if (!options.height) options.height = 0.4;
    if (!options.margin) options.margin = 3e-3;
    if (!options.padding) options.padding = 0.01;
    super(options);
    this.currentPanel = 0;
    this.isLowerCase = true;
    this.charsetCount = 1;
    let keymap;
    if (options.language || navigator.language) {
      switch (options.language || navigator.language) {
        case "fr":
        case "fr-CH":
        case "fr-CA":
          keymap = Keymaps.fr;
          break;
        case "ru":
          this.charsetCount = 2;
          keymap = Keymaps.ru;
          break;
        case "de":
        case "de-DE":
        case "de-AT":
        case "de-LI":
        case "de-CH":
          keymap = Keymaps.de;
          break;
        case "es":
        case "es-419":
        case "es-AR":
        case "es-CL":
        case "es-CO":
        case "es-ES":
        case "es-CR":
        case "es-US":
        case "es-HN":
        case "es-MX":
        case "es-PE":
        case "es-UY":
        case "es-VE":
          keymap = Keymaps.es;
          break;
        case "el":
          this.charsetCount = 2;
          keymap = Keymaps.el;
          break;
        case "nord":
          keymap = Keymaps.nord;
          break;
        default:
          keymap = Keymaps.eng;
          break;
      }
    } else {
      keymap = Keymaps.eng;
    }
    this.keys = [];
    this.panels = keymap.map((panel) => {
      const lineHeight = options.height / panel.length - options.margin * 2;
      const panelBlock = new Block({
        width: options.width + options.padding * 2,
        height: options.height + options.padding * 2,
        offset: 0,
        padding: options.padding,
        fontFamily: options.fontFamily,
        fontTexture: options.fontTexture,
        backgroundColor: options.backgroundColor,
        backgroundOpacity: options.backgroundOpacity
      });
      panelBlock.charset = 0;
      panelBlock.add(...panel.map((line) => {
        const lineBlock = new Block({
          width: options.width,
          height: lineHeight,
          margin: options.margin,
          contentDirection: "row",
          justifyContent: "center"
        });
        lineBlock.frame.visible = false;
        const keys = [];
        line.forEach((keyItem) => {
          const key = new Block({
            width: options.width * keyItem.width - options.margin * 2,
            height: lineHeight,
            margin: options.margin,
            justifyContent: "center",
            offset: 0
          });
          const char = keyItem.chars[panelBlock.charset].lowerCase || keyItem.chars[panelBlock.charset].icon || "undif";
          if (char === "enter" && options.enterTexture || char === "shift" && options.shiftTexture || char === "backspace" && options.backspaceTexture) {
            const url = (() => {
              switch (char) {
                case "backspace":
                  return options.backspaceTexture;
                case "enter":
                  return options.enterTexture;
                case "shift":
                  return options.shiftTexture;
                default:
                  console.warn("There is no icon image for this key");
              }
            })();
            Keyboard_textureLoader.load(url, (texture) => {
              key.add(
                new InlineBlock({
                  width: key.width * 0.65,
                  height: key.height * 0.65,
                  backgroundSize: "contain",
                  backgroundTexture: texture
                })
              );
            });
          } else {
            key.add(
              new Text({
                content: char,
                offset: 0
              })
            );
          }
          key.type = "Key";
          key.info = keyItem;
          key.info.input = char;
          key.panel = panelBlock;
          keys.push(key);
          this.keys.push(key);
        });
        lineBlock.add(...keys);
        return lineBlock;
      }));
      return panelBlock;
    });
    this.add(this.panels[0]);
    this.set(options);
  }
  /**
   * Used to switch to an entirely different panel of this keyboard,
   * with potentially a completely different layout
   */
  setNextPanel() {
    this.panels.forEach((panel) => {
      this.remove(panel);
    });
    this.currentPanel = (this.currentPanel + 1) % this.panels.length;
    this.add(this.panels[this.currentPanel]);
    this.update(true, true, true);
  }
  /*
   * Used to change the keys charset. Some layout support this,
   * like the Russian or Greek keyboard, to be able to switch to
   * English layout when necessary
   */
  setNextCharset() {
    this.panels[this.currentPanel].charset = (this.panels[this.currentPanel].charset + 1) % this.charsetCount;
    this.keys.forEach((key) => {
      const isInCurrentPanel = this.panels[this.currentPanel].getObjectById(key.id);
      if (!isInCurrentPanel) return;
      const char = key.info.chars[key.panel.charset] || key.info.chars[0];
      const newContent = this.isLowerCase || !char.upperCase ? char.lowerCase : char.upperCase;
      if (!key.childrenTexts.length) return;
      const textComponent = key.childrenTexts[0];
      key.info.input = newContent;
      textComponent.set({
        content: newContent
      });
      textComponent.update(true, true, true);
    });
  }
  /** Toggle case for characters that support it. */
  toggleCase() {
    this.isLowerCase = !this.isLowerCase;
    this.keys.forEach((key) => {
      const char = key.info.chars[key.panel.charset] || key.info.chars[0];
      const newContent = this.isLowerCase || !char.upperCase ? char.lowerCase : char.upperCase;
      if (!key.childrenTexts.length) return;
      const textComponent = key.childrenTexts[0];
      key.info.input = newContent;
      textComponent.set({
        content: newContent
      });
      textComponent.update(true, true, true);
    });
  }
  ////////////
  //  UPDATE
  ////////////
  parseParams() {
  }
  updateLayout() {
  }
  updateInner() {
  }
};
var update = () => UpdateManager.update();
var ThreeMeshUI = {
  Block,
  Text,
  InlineBlock,
  Keyboard,
  FontLibrary: core_FontLibrary,
  update,
  TextAlign: TextAlign_namespaceObject,
  Whitespace: Whitespace_namespaceObject,
  JustifyContent: JustifyContent_namespaceObject,
  AlignItems: AlignItems_namespaceObject,
  ContentDirection: ContentDirection_namespaceObject
};
if (typeof global !== "undefined") global.ThreeMeshUI = ThreeMeshUI;
var three_mesh_ui = ThreeMeshUI;
var __webpack_exports__AlignItems = __webpack_exports__.g1;
var __webpack_exports__Block = __webpack_exports__.gO;
var __webpack_exports__ContentDirection = __webpack_exports__.km;
var __webpack_exports__FontLibrary = __webpack_exports__.zV;
var __webpack_exports__InlineBlock = __webpack_exports__.ol;
var __webpack_exports__JustifyContent = __webpack_exports__.uM;
var __webpack_exports__Keyboard = __webpack_exports__.N1;
var __webpack_exports__Text = __webpack_exports__.xv;
var __webpack_exports__TextAlign = __webpack_exports__.PH;
var __webpack_exports__Whitespace = __webpack_exports__.UH;
var __webpack_exports__default = __webpack_exports__.ZP;
var __webpack_exports__update = __webpack_exports__.Vx;
export {
  __webpack_exports__AlignItems as AlignItems,
  __webpack_exports__Block as Block,
  __webpack_exports__ContentDirection as ContentDirection,
  __webpack_exports__FontLibrary as FontLibrary,
  __webpack_exports__InlineBlock as InlineBlock,
  __webpack_exports__JustifyContent as JustifyContent,
  __webpack_exports__Keyboard as Keyboard,
  __webpack_exports__Text as Text,
  __webpack_exports__TextAlign as TextAlign,
  __webpack_exports__Whitespace as Whitespace,
  __webpack_exports__default as default,
  __webpack_exports__update as update
};
//# sourceMappingURL=three-mesh-ui.js.map
