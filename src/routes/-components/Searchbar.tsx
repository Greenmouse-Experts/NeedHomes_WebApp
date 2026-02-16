import ThemeProvider from "@/simpleComps/ThemeProvider";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function SearchBar({ value, onChange }: any) {
  const form = useForm({
    defaultValues: {
      search: value,
    },
  });

  return (
    <ThemeProvider className=" mb-4">
      <form
        onSubmit={form.handleSubmit((data) => {
          onChange(data.search);
        })}
      >
        <input
          className="input input-lg"
          {...form.register("search")}
          placeholder="search email..."
        />
        <button
          className="btn ml-2 btn-primary btn-lg btn-square"
          type="submit"
        >
          <SearchIcon />
        </button>
      </form>
    </ThemeProvider>
  );
}
