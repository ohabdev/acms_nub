import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ScreenLoader from "@/components/screen-loader/ScreenLoader";
import { persistor, store } from "@/store";
import { antTheme, componentsToken } from "@/themeConfig";
import SEO from "@/next-seo.config";
import { defaultFont } from "@/utils/misc/fonts";
import "antd/dist/reset.css";
import "@/styles/globals.css";

const NextNProgress = dynamic(() => import("nextjs-progressbar"));
const DefaultSeo = dynamic(() =>
  import("next-seo").then((module) => module.DefaultSeo),
);
const App = dynamic(() => import("antd").then((module) => module.App));

const fontClass = `${defaultFont.variable} font-sans`;

const LoadApp = ({ Component, pageProps }) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const screenLoader = document.getElementById("screen-loader");
    if (screenLoader) {
      setTimeout(() => {
        setShowLoader(false);
      }, 550);
    }
  });

  return (
    <>
      <DefaultSeo {...SEO} />
      <NextNProgress
        showOnShallow={false}
        color={"#276EF1"}
        startPosition={0.1}
        stopDelayMs={100}
        height={3.0}
        options={{ showSpinner: false, trickleSpeed: 1200 }}
      />
      <ConfigProvider
        theme={{
          token: {
            ...antTheme,
            fontFamily: `${defaultFont.style.fontFamily}`,
          },
          ...componentsToken,
        }}
      >
        {!!showLoader && <ScreenLoader />}
        <div className={`${fontClass}`}>
          <Component {...pageProps} />
        </div>
      </ConfigProvider>
    </>
  );
};

const Application = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App message={{ maxCount: 1, top: 5 }} notification={{ maxCount: 1 }}>
            <LoadApp Component={Component} pageProps={pageProps} />
          </App>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default Application;
