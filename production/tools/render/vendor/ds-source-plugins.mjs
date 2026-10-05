// packages/jsx/src/source.ts
var ID_ATTR = "id";
var SOURCE_ATTR = "__source";
var LOOP_ATTR = "__loop";
var LOOP_TAGS = ["For", "Index"];
var isLoopTag = (tag) => LOOP_TAGS.includes(tag);
var COMPOSITION_TAGS = [
  "stage",
  "scene",
  "group",
  "rect",
  "video",
  "image",
  "audio",
  "text",
  "textRange",
  "sequence",
  "captions",
  "adjustmentLayer",
  "solidPaint",
  "linearGradientPaint",
  "radialGradientPaint",
  "imagePaint",
  "videoPaint",
  "colorStop",
  "stroke",
  "shadow",
  "effect",
  "mask",
  "animation",
  "keyframeTrack",
  "keyframe",
  "htmlPaint",
  "html",
  "shaderPaint",
  "surfacePaint",
  "surface"
];
var TAGS = new Set(COMPOSITION_TAGS);
function isCompositionTag(tag) {
  return TAGS.has(tag) || TAGS.has(tag.charAt(0).toLowerCase() + tag.slice(1));
}
var formatSource = (file, locator) => `${file}:${locator}`;

// packages/jsx/src/inspect.ts
var INSPECT_TAG = "inspect";
var INSPECT_TYPES = ["number", "color", "text", "font", "boolean", "select"];

// apps/desktop/src/source.ts
var COMPOSITION_COMPONENTS = new Map(
  COMPOSITION_TAGS.map((tag) => [tag, tag.charAt(0).toUpperCase() + tag.slice(1)])
);
var AMBIGUOUS_SVG_TAGS = /* @__PURE__ */ new Set(["rect", "text", "image"]);
var SVG_CONTAINERS = /* @__PURE__ */ new Set([
  "svg",
  "g",
  "defs",
  "symbol",
  "marker",
  "mask",
  "clipPath",
  "pattern",
  "filter",
  "linearGradient",
  "radialGradient",
  "textPath",
  "tspan",
  "switch"
]);
var PASCAL_ELEMENTS = new Map(
  [...COMPOSITION_COMPONENTS].map(([camel, pascal]) => [pascal, camel])
);
var SOLID_CONTROL_FLOW = /* @__PURE__ */ new Set([
  "For",
  "Show",
  "Switch",
  "Match",
  "Suspense",
  "SuspenseList",
  "Index",
  "ErrorBoundary"
]);
function hasSvgAncestor(path, types) {
  return path.findParent(
    (parent) => parent.isJSXElement() && types.isJSXIdentifier(parent.node.openingElement.name) && SVG_CONTAINERS.has(parent.node.openingElement.name.name)
  ) !== null;
}
function isSvgCollision(path, name, types) {
  return AMBIGUOUS_SVG_TAGS.has(name) && hasSvgAncestor(path, types);
}
function canonicalizeTagsPlugin({ types }) {
  return {
    name: "jsx-canonical-composition-tags",
    visitor: {
      // Babel merges plugin and preset visitors. Rewriting the complete tree
      // on Program enter ensures Solid cannot consume a parent before this
      // pass reaches its descendants.
      Program(program) {
        const aliases = /* @__PURE__ */ new Map();
        program.traverse({
          JSXElement(path) {
            const name = path.node.openingElement.name;
            if (!types.isJSXIdentifier(name)) return;
            if (/^[A-Z]/.test(name.name) && !path.scope.hasBinding(name.name)) {
              const camel = PASCAL_ELEMENTS.get(name.name);
              if (camel !== void 0) {
                throw path.buildCodeFrameError(
                  `<${name.name}> is not a tag; write the composition element as <${camel}>`
                );
              }
              if (SOLID_CONTROL_FLOW.has(name.name)) {
                throw path.buildCodeFrameError(
                  `<${name.name}> needs an import: add \`import { ${name.name} } from "solid-js"\``
                );
              }
              return;
            }
            const component = COMPOSITION_COMPONENTS.get(name.name);
            if (component === void 0 || isSvgCollision(path, name.name, types)) return;
            let alias = aliases.get(component);
            if (alias === void 0) {
              alias = program.scope.generateUidIdentifier(component).name;
              aliases.set(component, alias);
            }
            path.node.openingElement.name = types.jsxIdentifier(alias);
            if (path.node.closingElement) {
              path.node.closingElement.name = types.jsxIdentifier(alias);
            }
          }
        });
        if (aliases.size === 0) return;
        const specifiers = [...aliases].map(
          ([name, alias]) => types.importSpecifier(types.identifier(alias), types.identifier(name))
        );
        program.unshiftContainer(
          "body",
          types.importDeclaration(specifiers, types.stringLiteral("@diffusionstudio/jsx"))
        );
      }
    }
  };
}
var INSPECT_MODULE = "@diffusionstudio/jsx";
var INSPECT_ANNOTATION = new RegExp(`(?:^|\\n)\\s*\\*?\\s*@${INSPECT_TAG}\\b([^\\n]*)`);
var INSPECT_PAIR = /(\w+)=(?:"([^"]*)"|(\S+))/g;
var TS_VALUE_NODES = /* @__PURE__ */ new Set([
  "TSAsExpression",
  "TSSatisfiesExpression",
  "TSNonNullExpression",
  "TSInstantiationExpression"
]);
var inTypePosition = (reference) => reference.findParent((parent) => parent.node.type.startsWith("TS") && !TS_VALUE_NODES.has(parent.node.type)) !== null;
var isInspectType = (value) => INSPECT_TYPES.includes(value);
function parseInspectComments(comments) {
  const match = comments?.map((comment) => INSPECT_ANNOTATION.exec(comment.value)).find((found) => found !== null);
  if (!match) return void 0;
  const line = match[1].trim();
  const typeMatch = /^([A-Za-z]+)\b/.exec(line);
  if (!typeMatch || !isInspectType(typeMatch[1])) {
    throw new Error(`@${INSPECT_TAG} needs a control type: one of ${INSPECT_TYPES.join(", ")}`);
  }
  const type = typeMatch[1];
  const options = {};
  let rest = line.slice(typeMatch[0].length);
  rest = rest.replace(INSPECT_PAIR, (_, key, quoted, bare) => {
    if (key in options) throw new Error(`@${INSPECT_TAG}: "${key}" is given twice`);
    options[key] = quoted ?? bare ?? "";
    return "";
  });
  if (rest.trim()) throw new Error(`@${INSPECT_TAG}: cannot read "${rest.trim()}" \u2014 options are written as key=value`);
  const parsed = { type };
  for (const key of ["min", "max", "step"]) {
    const value = options[key];
    if (value === void 0) continue;
    if (type !== "number") throw new Error(`@${INSPECT_TAG}: "${key}" only applies to a number`);
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) throw new Error(`@${INSPECT_TAG}: "${key}" must be a number, not "${value}"`);
    parsed[key] = numeric;
  }
  const { path, label } = options;
  if (path !== void 0 && label !== void 0) {
    throw new Error(`@${INSPECT_TAG}: "path" already names the label \u2014 drop "label"`);
  }
  const spelled = path ?? label;
  if (spelled !== void 0) {
    const segments = spelled.split("/").map((segment) => segment.trim()).filter(Boolean);
    if (!segments.length) throw new Error(`@${INSPECT_TAG}: "${path === void 0 ? "label" : "path"}" is empty`);
    parsed.path = segments;
  }
  if (options.options !== void 0 && type !== "select") {
    throw new Error(`@${INSPECT_TAG}: "options" only applies to a select`);
  }
  if (type === "select") {
    const choices = (options.options ?? "").split(",").map((choice) => choice.trim()).filter(Boolean);
    if (choices.length < 2) {
      throw new Error(`@${INSPECT_TAG}: a select needs options to choose between, as options="a,b,c"`);
    }
    parsed.options = choices;
  }
  for (const key of Object.keys(options)) {
    if (!["min", "max", "step", "path", "label", "options"].includes(key)) {
      throw new Error(`@${INSPECT_TAG}: unknown option "${key}"`);
    }
  }
  return parsed;
}
function inspectInitializer(node, type) {
  if (!node) return void 0;
  if (type === "number") {
    if (node.type === "NumericLiteral") return node;
    if (node.type === "UnaryExpression" && (node.operator === "-" || node.operator === "+") && node.argument.type === "NumericLiteral") return node;
    return void 0;
  }
  if (type === "boolean") return node.type === "BooleanLiteral" ? node : void 0;
  return node.type === "StringLiteral" ? node : void 0;
}
var INSPECT_LITERALS = {
  number: "number",
  boolean: "true/false",
  color: "string",
  text: "string",
  font: "string",
  select: "string"
};
function inspectPlugin({ types }, { file }) {
  return {
    name: "jsx-inspect-variables",
    visitor: {
      // On Program enter, like the other passes: everything is rewritten
      // before Solid's transform consumes the JSX the references sit in.
      Program(program) {
        const helper = program.scope.generateUidIdentifier("inspect");
        let used = false;
        program.traverse({
          VariableDeclaration(path) {
            let annotation;
            try {
              annotation = parseInspectComments(path.node.leadingComments) ?? (path.parentPath.isExportNamedDeclaration() ? parseInspectComments(path.parentPath.node.leadingComments) : void 0);
            } catch (error) {
              throw path.buildCodeFrameError(error.message);
            }
            if (!annotation) return;
            if (path.parentPath.isExportNamedDeclaration()) {
              throw path.buildCodeFrameError(
                `an @${INSPECT_TAG} variable cannot be exported: another module would import the value, not the control`
              );
            }
            if (!path.parentPath.isProgram()) {
              throw path.buildCodeFrameError(`@${INSPECT_TAG} only works on a top-level const`);
            }
            if (path.node.kind !== "const" || path.node.declarations.length !== 1) {
              throw path.buildCodeFrameError(`@${INSPECT_TAG} annotates a single const declaration`);
            }
            const declarator = path.node.declarations[0];
            if (declarator.id.type !== "Identifier") {
              throw path.buildCodeFrameError(`@${INSPECT_TAG} needs a plain name, not a destructuring`);
            }
            const name = declarator.id.name;
            const initial = inspectInitializer(declarator.init, annotation.type);
            if (!initial) {
              throw path.buildCodeFrameError(
                `an @${INSPECT_TAG} ${annotation.type} must be initialized with a ${INSPECT_LITERALS[annotation.type]} literal \u2014 it is what the editor writes back to`
              );
            }
            if (annotation.type === "select" && initial.type === "StringLiteral" && !annotation.options.includes(initial.value)) {
              throw path.buildCodeFrameError(
                `an @${INSPECT_TAG} select is initialized with "${initial.value}", which is not one of its options (${annotation.options.join(", ")})`
              );
            }
            const binding = program.scope.getBinding(name);
            for (const reference of binding?.referencePaths ?? []) {
              if (inTypePosition(reference)) continue;
              if (reference.parentPath?.isExportSpecifier()) {
                throw reference.buildCodeFrameError(
                  `an @${INSPECT_TAG} variable cannot be exported: another module would import the value, not the control`
                );
              }
              const parent = reference.parent;
              if (parent.type === "ObjectProperty" && parent.shorthand) parent.shorthand = false;
              reference.replaceWith(types.callExpression(types.identifier(name), []));
            }
            const declaration = { file, name, ...annotation };
            declarator.init = types.callExpression(types.cloneNode(helper), [types.valueToNode(declaration), initial]);
            used = true;
          }
        });
        if (!used) return;
        program.unshiftContainer(
          "body",
          types.importDeclaration(
            [types.importSpecifier(helper, types.identifier("__inspect"))],
            types.stringLiteral(INSPECT_MODULE)
          )
        );
      }
    }
  };
}
var jsxTagName = (element) => {
  const name = element.openingElement.name;
  return name.type === "JSXIdentifier" ? name.name : void 0;
};
function sourcePlugin({ types }, { file }) {
  return {
    name: "jsx-source-location",
    visitor: {
      // Stamped up front: Solid's transform replaces whole JSX trees, so by the
      // time a nested element would be visited normally it no longer exists.
      Program(program) {
        let index = 0;
        const positions = /* @__PURE__ */ new WeakMap();
        program.traverse({
          JSXElement(path) {
            const position = index++;
            positions.set(path.node, position);
            const opening = path.node.openingElement;
            const name = opening.name;
            if (name.type !== "JSXIdentifier" || !isCompositionTag(name.name) || isSvgCollision(path, name.name, types)) return;
            const loop = path.findParent(
              (parent) => parent.isJSXElement() && isLoopTag(jsxTagName(parent.node) ?? "")
            );
            const loopPosition = loop ? positions.get(loop.node) : void 0;
            let locator = position;
            opening.attributes = opening.attributes.filter((attribute) => {
              if (attribute.type !== "JSXAttribute" || attribute.name.type !== "JSXIdentifier" || attribute.name.name !== ID_ATTR) {
                return true;
              }
              if (attribute.value?.type === "StringLiteral") locator = attribute.value.value;
              return false;
            });
            opening.attributes.push(
              types.jsxAttribute(
                types.jsxIdentifier(SOURCE_ATTR),
                types.stringLiteral(formatSource(file, locator))
              )
            );
            if (loopPosition !== void 0) {
              opening.attributes.push(
                types.jsxAttribute(
                  types.jsxIdentifier(LOOP_ATTR),
                  types.stringLiteral(formatSource(file, loopPosition))
                )
              );
            }
          }
        });
      }
    }
  };
}
export {
  canonicalizeTagsPlugin,
  inspectPlugin,
  sourcePlugin
};
