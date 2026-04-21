import "../styles/Pagination.css";
export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem   = Math.min(currentPage * itemsPerPage, totalItems);

  const st = {
    wrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "16px",
      fontSize: "13px",
      color: "var(--text-muted, #888)",
    },
    pageBtn: (isActive) => ({
      padding: "5px 11px",
      borderRadius: "6px",
      border: "1px solid var(--border-color, #ddd)",
      background: isActive ? "#e85d04" : "#fff",
      color: isActive ? "#fff" : "#555",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: isActive ? "600" : "400",
      marginLeft: "4px",
    }),
    prevNextBtn: (disabled) => ({
      padding: "5px 11px",
      borderRadius: "6px",
      border: "1px solid var(--border-color, #ddd)",
      background: "var(--card-bg, #fff)",
      color: disabled ? "#ccc" : "#555",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: "13px",
      marginLeft: "4px",
    }),
  };

  if (totalPages <= 1) {
    return (
      <div style={st.wrapper}>
        <span>Showing {startItem}–{endItem} of {totalItems} orders</span>
      </div>
    );
  }

  return (
    <div style={st.wrapper}>

      <span>
        Showing {startItem}–{endItem} of {totalItems} orders
      </span>

      <div>
        <button
          style={st.prevNextBtn(currentPage === 1)}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            style={st.pageBtn(currentPage === page)}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          style={st.prevNextBtn(currentPage === totalPages)}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}