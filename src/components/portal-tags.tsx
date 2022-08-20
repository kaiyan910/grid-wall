import { trpc } from "@/utils/trpc";
import { XIcon } from "@heroicons/react/solid";
import { Hint } from "react-autocomplete-hint";
import { useRef, useState } from "react";

type Props = {
  onTagsChanged: (tags: { id: number | undefined; name: string }[]) => void;
  disabled: boolean;
  presetTags?: { id: number | undefined; name: string }[];
};

const PortalTags: React.FC<Props> = ({
  onTagsChanged,
  disabled,
  presetTags,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const availableTags = trpc.useQuery(["obtain-tags"]);
  const [tags, setTags] = useState<{ id: number | undefined; name: string }[]>(
    presetTags ?? []
  );

  const onTagDeleted = (removeIndex: number) => {
    const newTags = tags.filter((_, index) => index !== removeIndex);
    setTags(newTags);
    onTagsChanged(newTags);
  };

  const onTagEntered = () => {
    const value = inputRef.current!!.value;
    if (tags.some((tag) => tag.name === value)) {
      return;
    }
    const existingTagId =
      availableTags.data?.find((tag) => tag.name === value)?.id ?? undefined;
    const newTags = [
      ...tags,
      { id: existingTagId, name: inputRef.current!!.value },
    ];
    setTags(newTags);
    inputRef.current!!.value = "";
    onTagsChanged(newTags);
  };

  return (
    <div>
      <Hint options={availableTags.data?.map((tag) => tag.name) ?? []}>
        <input
          type="text"
          ref={inputRef}
          className="input input-bordered w-full"
          placeholder="標籤"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onTagEntered();
            }
          }}
        />
      </Hint>
      <div className="flex items-center justify-end space-x-2 mt-4">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex justify-center items-center space-x-2 bg-accent text-base-100 px-2 rounded-lg cursor-pointer"
          >
            <span>{tag.name}</span>
            <XIcon width={16} height={16} onClick={() => onTagDeleted(index)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortalTags;
