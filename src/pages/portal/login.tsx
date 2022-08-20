import { GetServerSideProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { ViewGridIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.data) {
      router.replace("/portal");
    }
  }, [router, session]);

  return (
    <div className="flex h-screen items-center justify-center bg-login bg-cover relative">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
      <div className="flex flex-col items-center justify-centerp-4 z-10">
        <div className="flex space-x-4 items-center justify-center">
          <ViewGridIcon
            className="animate-pulse"
            width="48"
            height="48"
            fill="#FFF"
          />
          <span className="font-logo text-8xl md:text-9xl text-white">
            Grid Wall
          </span>
        </div>
        <div className="font-caption text-sm md:text-base text-white text-end self-end">
          showing your photos on a beautiful wall
        </div>
        <button
          className="btn btn-primary w-48 mt-8"
          onClick={() => signIn("auth0")}
        >
          登入
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (session) {
    return {
      redirect: {
        destination: "/portal",
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

export default LoginPage;
