import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
