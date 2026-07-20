import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = fileURLToPath(new URL(".", import.meta.url));
const reactDevModuleId = "\0geolux/react-dev-module";
const reactDomDevModuleId = "\0geolux/react-dom-dev-module";
const reactDomClientDevModuleId = "\0geolux/react-dom-client-dev-module";
const jsxRuntimeDevModuleId = "\0geolux/react-jsx-runtime-dev-module";

const reactDevModule = `
  const React = globalThis.React;
  if (!React) throw new Error("React UMD no se cargo correctamente.");
  export default React;
  export const Children = React.Children;
  export const Component = React.Component;
  export const Fragment = React.Fragment;
  export const Profiler = React.Profiler;
  export const PureComponent = React.PureComponent;
  export const StrictMode = React.StrictMode;
  export const Suspense = React.Suspense;
  export const cloneElement = React.cloneElement;
  export const createContext = React.createContext;
  export const createElement = React.createElement;
  export const createFactory = React.createFactory;
  export const createRef = React.createRef;
  export const forwardRef = React.forwardRef;
  export const isValidElement = React.isValidElement;
  export const lazy = React.lazy;
  export const memo = React.memo;
  export const startTransition = React.startTransition;
  export const useCallback = React.useCallback;
  export const useContext = React.useContext;
  export const useDebugValue = React.useDebugValue;
  export const useDeferredValue = React.useDeferredValue;
  export const useEffect = React.useEffect;
  export const useId = React.useId;
  export const useImperativeHandle = React.useImperativeHandle;
  export const useInsertionEffect = React.useInsertionEffect;
  export const useLayoutEffect = React.useLayoutEffect;
  export const useMemo = React.useMemo;
  export const useReducer = React.useReducer;
  export const useRef = React.useRef;
  export const useState = React.useState;
  export const useSyncExternalStore = React.useSyncExternalStore;
  export const useTransition = React.useTransition;
  export const version = React.version;
`;

const reactDomDevModule = `
  const ReactDOM = globalThis.ReactDOM;
  if (!ReactDOM) throw new Error("ReactDOM UMD no se cargo correctamente.");
  export default ReactDOM;
  export const createPortal = ReactDOM.createPortal;
  export const flushSync = ReactDOM.flushSync;
  export const hydrate = ReactDOM.hydrate;
  export const render = ReactDOM.render;
  export const unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
  export const unstable_batchedUpdates = ReactDOM.unstable_batchedUpdates;
  export const version = ReactDOM.version;
`;

const reactDomClientDevModule = `
  const ReactDOM = globalThis.ReactDOM;
  if (!ReactDOM) throw new Error("ReactDOM UMD no se cargo correctamente.");
  export const createRoot = ReactDOM.createRoot;
  export const hydrateRoot = ReactDOM.hydrateRoot;
  export default { createRoot, hydrateRoot };
`;

const jsxRuntimeDevModule = `
  import React from "/node_modules/react/index.js";
  export const Fragment = React.Fragment;
  export function jsx(type, props, key) {
    const normalizedProps = key === undefined ? { ...(props || {}) } : { ...(props || {}), key };
    if (!Object.prototype.hasOwnProperty.call(normalizedProps, "children")) {
      return React.createElement(type, normalizedProps);
    }

    const children = normalizedProps.children;
    delete normalizedProps.children;
    return Array.isArray(children)
      ? React.createElement(type, normalizedProps, ...children)
      : React.createElement(type, normalizedProps, children);
  }
  export const jsxs = jsx;
  export const jsxDEV = jsx;
`;

function readDependencySource(...pathParts) {
  return readFileSync(resolve(configDir, "node_modules", ...pathParts), "utf8");
}

function wrapCommonJsModule({ source, imports = [], requireMap = {}, namedExports = [] }) {
  const importStatements = imports.map(({ name, url }) => `import ${name} from "${url}";`).join("\n");
  const requireCases = Object.entries(requireMap)
    .map(([request, variableName]) => `if (id === ${JSON.stringify(request)}) return ${variableName};`)
    .join("\n");
  const namedExportStatements = namedExports
    .map((name) => `export const ${name} = cjs.${name};`)
    .join("\n");

  return `
    ${importStatements}
    const module = { exports: {} };
    const exports = module.exports;
    const process = { env: { NODE_ENV: "development" } };
    const require = (id) => {
      ${requireCases}
      throw new Error("Modulo CommonJS no cubierto en GeoLux dev shim: " + id);
    };
    new Function("module", "exports", "require", "process", ${JSON.stringify(source)})(module, exports, require, process);
    const cjs = module.exports;
    export default cjs;
    ${namedExportStatements}
  `;
}

function schedulerDevModule() {
  return wrapCommonJsModule({
    source: readDependencySource("scheduler", "cjs", "scheduler.development.js"),
    namedExports: [
      "unstable_IdlePriority",
      "unstable_ImmediatePriority",
      "unstable_LowPriority",
      "unstable_NormalPriority",
      "unstable_Profiling",
      "unstable_UserBlockingPriority",
      "unstable_cancelCallback",
      "unstable_continueExecution",
      "unstable_forceFrameRate",
      "unstable_getCurrentPriorityLevel",
      "unstable_getFirstCallbackNode",
      "unstable_next",
      "unstable_now",
      "unstable_pauseExecution",
      "unstable_requestPaint",
      "unstable_runWithPriority",
      "unstable_scheduleCallback",
      "unstable_shouldYield",
      "unstable_wrapCallback",
    ],
  });
}

function reactReconcilerConstantsDevModule() {
  return wrapCommonJsModule({
    source: readDependencySource("react-reconciler", "cjs", "react-reconciler-constants.development.js"),
    namedExports: [
      "ConcurrentRoot",
      "ContinuousEventPriority",
      "DefaultEventPriority",
      "DiscreteEventPriority",
      "IdleEventPriority",
      "LegacyRoot",
    ],
  });
}

function reactReconcilerDevModule() {
  return wrapCommonJsModule({
    source: readDependencySource("react-reconciler", "cjs", "react-reconciler.development.js"),
    imports: [
      { name: "React", url: "/node_modules/react/index.js" },
      { name: "Scheduler", url: "/node_modules/scheduler/index.js" },
    ],
    requireMap: {
      react: "React",
      scheduler: "Scheduler",
    },
  });
}

function resolveReactNodeModuleRequest(pathname) {
  if (pathname === "/node_modules/react/index.js") return reactDevModule;
  if (pathname === "/node_modules/react/jsx-runtime.js") return jsxRuntimeDevModule;
  if (pathname === "/node_modules/react/jsx-dev-runtime.js") return jsxRuntimeDevModule;
  if (pathname === "/node_modules/react-dom/index.js") return reactDomDevModule;
  if (pathname === "/node_modules/react-dom/client.js") return reactDomClientDevModule;
  if (pathname === "/node_modules/scheduler/index.js") return schedulerDevModule();
  if (pathname === "/node_modules/react-reconciler/constants.js") return reactReconcilerConstantsDevModule();
  if (pathname === "/node_modules/react-reconciler/index.js") return reactReconcilerDevModule();
  return null;
}

function reactDevShimPlugin() {
  return {
    name: "geolux-react-dev-shim",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const { pathname } = new URL(req.url, "http://localhost");
        const shim = resolveReactNodeModuleRequest(pathname);
        if (!shim) {
          next();
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Cache-Control", "no-store");
        res.end(shim);
      });
    },
    transformIndexHtml(html) {
      return html.replace(
        "</head>",
        [
          '<script src="/node_modules/react/umd/react.development.js"></script>',
          '<script src="/node_modules/react-dom/umd/react-dom.development.js"></script>',
          "</head>",
        ].join("\n"),
      );
    },
    resolveId(id) {
      if (id === "react") return reactDevModuleId;
      if (id === "react-dom") return reactDomDevModuleId;
      if (id === "react-dom/client") return reactDomClientDevModuleId;
      if (id === "react/jsx-runtime" || id === "react/jsx-dev-runtime") return jsxRuntimeDevModuleId;
      return null;
    },
    load(id) {
      if (id === reactDevModuleId) {
        return reactDevModule;
      }

      if (id === reactDomDevModuleId) {
        return reactDomDevModule;
      }

      if (id === reactDomClientDevModuleId) {
        return reactDomClientDevModule;
      }

      if (id === jsxRuntimeDevModuleId) {
        return jsxRuntimeDevModule;
      }

      return null;
    },
  };
}

export default {
  plugins: [reactDevShimPlugin()],
  server: {
    host: "0.0.0.0",
  },
  optimizeDeps: {
    noDiscovery: true,
    include: [],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
};
