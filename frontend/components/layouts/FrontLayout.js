import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Head from "next/head";
import { Layout } from "antd";
import PropTypes from "prop-types";
import NavigationBar from "@/components/navigation/NavigationBar";
import HomeFilled from "@ant-design/icons/HomeFilled";
import { useMediaQuery } from "@/utils/hooks/useMediaQuery";

const Menu = dynamic(() => import("antd/lib/menu"));
const { Content, Sider, Header } = Layout;

const getItem = (label, key, icon, children) => {
  return {
    key,
    icon,
    children,
    label,
  };
};

const items = [
  getItem(
    <Link href="/"> Dashboard</Link>,
    "/",
    <HomeFilled className="!text-white" />,
  ),
];

const FrontLayout = ({ children, title = "" }) => {
  const { user } = useSelector((state) => state.auth);
  const [current, setCurrent] = useState("");
  const router = useRouter();
  const matches = useMediaQuery("(min-width: 768px)");
  const isProvider = user?.role?.isProvider;

  useEffect(() => {
    if (router) {
      if (current !== router.pathname) {
        setCurrent(router.pathname);
      }
    }
  }, [router, current]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

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
      <Layout className="h-screen">
        <Header className={`fixed top-0 z-[50] w-full !bg-[#fdfffe] shadow-sm`}>
          <NavigationBar />
        </Header>
        <Layout className="flex-row">
          <Content
            className={`relative top-[60px] h-[calc(100vh-60px)] bg-white transition-all duration-200`}
          >
            {children}
          </Content>
        </Layout>
        {!user && isProvider && (
          <Layout hasSider>
            <Sider
              trigger={null}
              className="!fixed top-[60px] z-10 max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)] overflow-auto"
              width={matches ? 180 : 160}
              theme="dark"
            >
              <Menu
                theme="dark"
                mode="inline"
                items={items}
                inlineIndent={10}
                selectedKeys={[current]}
                onClick={onClick}
              />
            </Sider>
            <Content
              className={`${
                matches ? "ml-[180px]" : "ml-[160px]"
              } relative top-[60px] h-[calc(100vh-60px)] bg-white transition-all duration-200`}
            >
              {children}
            </Content>
          </Layout>
        )}
      </Layout>
    </>
  );
};

FrontLayout.propTypes = {
  title: PropTypes.string,
};

export default FrontLayout;
