import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "../../api/auth/[...nextauth]";
import PortalTags from "@/components/portal-tags";
import PortalWrapper from "@/components/portal-wrapper";
import { ChangeEvent, useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { XIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { Image, Tag } from "@prisma/client";

type ImageCreateProps = {
  location: string;
  description: string;
  source: string;
  tags: { id: number | undefined; name: string }[];
  image: string;
};

type Props = {
  image?: (Image & { tags: Tag[] }) | undefined;
};

const PortalCreatePage: NextPage<Props> = ({ image }) => {
  const router = useRouter();
  const createMutation = trpc.useMutation(["create-image"]);
  const updateMutation = trpc.useMutation(["update-image"]);

  const [form, setForm] = useState<ImageCreateProps>({
    location: image?.location ?? "",
    description: image?.description ?? "",
    source: image?.source ?? "",
    tags: image?.tags.map((tag) => ({ id: tag.id, name: tag.name })) ?? [],
    image: image?.image ?? "",
  });

  const onTextInputChangd = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onTagsChanged = (tags: { id: number | undefined; name: string }[]) => {
    setForm({
      ...form,
      tags,
    });
  };

  const onSumitted = () => {
    if (!image) {
      createMutation.mutate(form);
    } else {
      const updateProps = { ...form, id: image.id };
      updateMutation.mutate(updateProps);
    }
  };

  const toBase64 = (file: FileList): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onFileChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = await toBase64(files);
      console.log(image);
      setForm({
        ...form,
        image,
      });
    }
  };

  useEffect(() => {
    if (createMutation.status === "success" || updateMutation.status === "success") {
      router.replace("/portal");
    }
  }, [router, createMutation.status, updateMutation.status]);

  return (
    <PortalWrapper>
      <section>
        <div className="p-16">
          <h1 className="font-sans text-4xl">{image ? "更新" : "建立"}圖片</h1>
          {createMutation.error || updateMutation.error ? (
            <div className="alert alert-error shadow-lg mt-4">
              <div>
                <XIcon width={12} height={12} />
                <span>{createMutation.error ? createMutation.error.message : updateMutation.error?.message}</span>
              </div>
            </div>
          ) : null}
          <div className="mt-8 flex flex-col space-y-4">
            <input
              type="text"
              placeholder="地點"
              name="location"
              value={form.location}
              onChange={(e) => onTextInputChangd(e)}
              className="input input-bordered w-full"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            />
            <textarea
              className="textarea textarea-bordered min-h-[100px]"
              name="description"
              placeholder="介紹"
              value={form.description}
              onChange={(e) => onTextInputChangd(e)}
              disabled={createMutation.isLoading || updateMutation.isLoading}
            />
            <input
              type="text"
              placeholder="來源"
              name="source"
              value={form.source}
              className="input input-bordered w-full"
              onChange={(e) => onTextInputChangd(e)}
              disabled={createMutation.isLoading || updateMutation.isLoading}
            />
            <PortalTags
              presetTags={form.tags}
              onTagsChanged={onTagsChanged}
              disabled={createMutation.isLoading || updateMutation.isLoading}
            />
            <input
              type="file"
              name="image"
              onChange={(e) => onFileChanged(e)}
              accept="image/*"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral file:text-base-100 hover:file:bg-neutral-focus"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            />
            <button
              className={`btn btn-primary ${
                createMutation.isLoading || updateMutation.isLoading ? "loading" : ""
              }`}
              onClick={() => onSumitted()}
            >
              {image ? "更新" : "建立"}
            </button>
          </div>
        </div>
      </section>
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

export default PortalCreatePage;
