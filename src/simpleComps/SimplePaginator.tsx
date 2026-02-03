import { usePagination } from "@/helpers/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SimplePaginator() {
  const { page, setPagination } = usePagination();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      // Removed totalPages check
      setPagination(newPage); // Changed to newPage directly
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Maximum number of visible page buttons

    // Without totalPages, we can only show a limited set around the current page
    // and assume there might be more pages.
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    // Adjust startPage if it goes too far back (e.g., if page is 1 or 2)
    if (page < Math.ceil(maxButtons / 2)) {
      startPage = 1;
      endPage = maxButtons;
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          className={`join-item btn ${page === 1 ? "btn-active btn-primary" : ""}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>,
      );
      if (startPage > 2) {
        buttons.push(
          <button key="ellipsis-start" className="join-item btn btn-disabled">
            ...
          </button>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`join-item btn ${page === i ? "btn-active btn-primary" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }

    // Since totalPages is removed, we can't determine the end.
    // We can show an ellipsis to suggest more pages are available.
    buttons.push(
      <button key="ellipsis-end" className="join-item btn btn-disabled">
        ...
      </button>,
    );

    return buttons;
  };

  // Without totalPages, we always show the paginator assuming there could be more pages.
  // The only condition to hide it would be if we explicitly know there's only one page,
  // which we can't determine here.

  return (
    <div className="flex justify-center items-center my-4">
      <div className="join">
        <button
          className="join-item btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {renderPageButtons()}
        <button
          className="join-item btn"
          onClick={() => handlePageChange(page + 1)}
          // Without totalPages, we can't disable the "next" button based on the last page.
          // It will always be enabled, implying there might always be a next page.
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
