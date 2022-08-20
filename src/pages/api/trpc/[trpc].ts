import { appRouter } from "@/server/routers";
import * as trpcNext from "@trpc/server/adapters/next";

import { createContext } from "@/server/context";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  // called for each incoming request
  createContext,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};
