import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "@/server/context";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { uploadFile } from "@/utils/aws";
import { resizeImage } from "@/utils";

// declare all endpoint
// different module should have their own router (i.e. userRouter, imageRouter)
// and finally use merge(...) to become one router for exprot
//
// const appRouter = createRouter()
// prefix user procedures with "user."
//    .merge('user.', users)
// prefix post procedures with "post."
//    .merge('post.', posts);

interface AppRouterMeta {
  needAuth: boolean;
}

export const appRouter = trpc
  .router<Context, AppRouterMeta>()
  .middleware(({ meta, ctx, next }) => {
    if (meta?.needAuth && !ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
    return next();
  })
  .query("obtain-tags", {
    meta: {
      needAuth: true,
    },
    async resolve() {
      return await prisma.tag.findMany();
    },
  })
  .query("obtain-image", {
    meta: {
      needAuth: false,
    },
    async resolve() {
      return await prisma.image.findMany({
        include: {
          tags: true,
        },
        take: 24,
        orderBy: {
          id: "desc",
        },
      });
    },
  })
  // [TO-DO] apply paging for portal
  .query("obtain-all-image", {
    meta: {
      needAuth: true,
    },
    async resolve() {
      return await prisma.image.findMany({
        include: {
          tags: true,
        },
        orderBy: {
          id: "desc",
        },
      });
    },
  })
  .query("obtain-image-by-id", {
    meta: {
      needAuth: false,
    },
    input: z.object({ id: z.number().min(1) }),
    async resolve({ ctx, input }) {
      return await prisma.image.findFirstOrThrow({
        where: { id: input.id },
        include: { tags: true },
      });
    },
  })
  .mutation("delete-image", {
    meta: {
      needAuth: true,
    },
    input: z.object({ id: z.number().min(1) }),
    async resolve({ ctx, input }) {
      return await prisma.image.delete({ where: { id: input.id } });
    },
  })
  .mutation("update-image", {
    meta: {
      needAuth: true,
    },
    input: z.object({
      id: z.number().min(1),
      location: z.string().min(1),
      description: z.string().min(1),
      source: z.string().min(1),
      image: z.string().min(1),
      thumbnail: z.string(),
      tags: z
        .object({
          id: z.number().optional(),
          name: z.string(),
        })
        .array()
        .min(1),
    }),
    async resolve({ ctx, input }) {
      const hasNewImage = !input.image.startsWith("http");

      const thumbnailBase64 = hasNewImage
        ? await resizeImage(input.image)
        : null;
      const thumbnail = thumbnailBase64
        ? await uploadFile(input.image)
        : input.thumbnail;

      const image = hasNewImage ? await uploadFile(input.image) : input.image;

      await prisma.image.update({
        data: {
          location: input.location,
          description: input.description,
          source: input.source,
          image,
          thumbnail: thumbnail,
          tags: {
            deleteMany: {},
            connectOrCreate: input.tags.map((tag) => ({
              where: {
                name: tag.name,
              },
              create: {
                id: tag.id,
                name: tag.name,
                createdBy: ctx.session?.user?.name ?? "admin",
                updatedBy: ctx.session?.user?.name ?? "admin",
              },
            })),
          },
        },
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("create-image", {
    meta: {
      needAuth: false,
    },
    input: z.object({
      location: z.string().min(1),
      description: z.string().min(1),
      source: z.string().min(1),
      image: z.string().min(1),
      tags: z
        .object({
          id: z.number().optional(),
          name: z.string(),
        })
        .array()
        .min(1),
    }),
    async resolve({ ctx, input }) {
      const thumbnailBase64 = await resizeImage(input.image);
      const image = await uploadFile(input.image);
      const thumbnail = await uploadFile(thumbnailBase64);

      return await prisma.image.create({
        data: {
          location: input.location,
          description: input.description,
          source: input.source,
          image,
          thumbnail,
          createdBy: ctx.session?.user?.name ?? "admin",
          updatedBy: ctx.session?.user?.name ?? "admin",
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: {
                name: tag.name,
              },
              create: {
                id: tag.id,
                name: tag.name,
                createdBy: ctx.session?.user?.name ?? "admin",
                updatedBy: ctx.session?.user?.name ?? "admin",
              },
            })),
          },
        },
      });
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
