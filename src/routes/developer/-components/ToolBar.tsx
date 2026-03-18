import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/Input";
import { Calendar, ChevronDown, Filter, Search } from "lucide-react";
import { useState } from "react";

export default function ToolbarSec() {
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full">
            <div className="relative flex-1 min-w-[200px] md:flex-initial md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs md:text-sm"
            >
              <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs md:text-sm"
            >
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <DropdownMenu
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs md:text-sm"
                >
                  Bulk Action
                  <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Export Selected</DropdownMenuItem>
              {/*<DropdownMenuItem>Delete Selected</DropdownMenuItem>*/}
              <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
