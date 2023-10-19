import Head from "next/head";

const DefaultLayout = (props) => {
  return (
    <>
      <Head>
        <title>Lawyers2Go</title>
        <meta name="description" content="Lawyers2Go" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {props.children}
    </>
  );
};

export default DefaultLayout;
