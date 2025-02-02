import type { FunctionComponent } from "react";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import type { AppPropsWithLayout } from "../types";

import { theme } from "../components/common";

const MyApp: FunctionComponent<AppPropsWithLayout> = (
  props: AppPropsWithLayout
) => {
  const { Component, pageProps } = props;
  const router = useRouter();

  const getLayout = Component.getLayout || ((children) => children);

  useEffect(() => {
    /* Remove the server-side injected CSS. */
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <title>Hypertool</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  );
};

export default MyApp;
