import ThemeProvider from "./ThemeProvider";

interface AvatarProps {
  url: string;
  alt?: string;
}

export default function SimpleAvatar({ url, alt }: AvatarProps) {
  const isUrl = url?.trim();
  const firstLetter = alt?.charAt(0).toUpperCase() || "A";
  return (
    <div className="avatar">
      <div className="w-24 rounded-full ">
        {isUrl ? (
          <img src={url} alt={alt} />
        ) : (
          <div className="w-24 h-24 bg-primary rounded-full grid place-items-center text-2xl text-white">
            {firstLetter}
          </div>
        )}
      </div>
    </div>
  );
}
