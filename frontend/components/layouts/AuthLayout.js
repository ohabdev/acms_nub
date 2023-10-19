import Head from "next/head";
import { Layout } from "antd";
import PropTypes from "prop-types";

const { Content } = Layout;

const AuthLayout = ({ children, title = "", withCover }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Lawyers2Go" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Content className="h-screen bg-white">
          <div className="flex min-w-0 flex-row flex-wrap">
            {!!withCover && (
              <div className="relative block max-w-[50%] flex-[0_0_50%]">
                <section
                  className="fixed hidden h-full w-1/2 flex-col items-center justify-center p-4 text-center font-bold md:flex"
                  style={{
                    backgroundImage: 'url("login_bg.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-full w-full bg-black opacity-50"
                    style={{ zIndex: 1 }}
                  ></div>
                  <div className="relative z-10">
                    <h2 className="mb-4 font-bold text-white">
                      Attorney Case Management System.
                    </h2>
                    <h5 className="max-w-lg text-lg italic leading-6 text-white">
                      A Trusted Platform for attorney case management system.
                    </h5>
                  </div>
                </section>
              </div>
            )}
            <div
              className={`relative block max-w-[100%] flex-[0_0_100%] ${
                withCover ? "md:max-w-[50%] md:flex-[0_0_50%]" : ""
              }`}
            >
              <section className="flex min-h-screen items-center justify-center md:p-2">
                {children}
              </section>
            </div>
          </div>
        </Content>
      </Layout>
    </>
  );
};

AuthLayout.propTypes = {
  title: PropTypes.string,
  withCover: PropTypes.bool,
};

export default AuthLayout;
