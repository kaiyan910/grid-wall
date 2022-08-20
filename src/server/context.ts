import { nextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";

// call for every incoming request
export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  return {
    session
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
