import { GetServerSideProps } from "next";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]";
import PortalGrid from "@/components/portal-grid";
import PortalWrapper from "@/components/portal-wrapper";

const PortalPage: NextPage = () => {
  return (
    <PortalWrapper>
      <PortalGrid />
    </PortalWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/portal/login",
        permanent: true,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default PortalPage;
