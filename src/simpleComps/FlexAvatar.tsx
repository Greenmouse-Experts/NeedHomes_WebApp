import ThemeProvider from "./ThemeProvider";

interface AvatarProps {
  url: string;
  alt?: string;
}

export default function Flex({ url, alt }: AvatarProps) {
  const isUrl = url?.trim();
  const firstLetter = alt?.charAt(0).toUpperCase() || "A";
  return (
    <div className="avatar">
      <div className="flex flex-1 rounded-full ">
        {isUrl ? (
          <img src={url} alt={alt} />
        ) : (
          <div className="flex-1 aspect-square bg-primary rounded-full grid place-items-center text-2xl text-white">
            {firstLetter}
          </div>
        )}
      </div>
    </div>
  );
}
