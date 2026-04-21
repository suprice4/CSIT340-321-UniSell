const STATUS_COLORS = {
  Delivered:  { bg: "#f0fff4", color: "#276749" },
  Shipped:    { bg: "#ebf8ff", color: "#2b6cb0" },
  Pending:    { bg: "#fefce8", color: "#854d0e" },
  Processing: { bg: "#faf5ff", color: "#6b21a8" },
  Cancelled:  { bg: "#fff5f5", color: "#9b2c2c" },
};

const PLATFORM_BADGE = {
  Shopee:          { bg: "#fff1ee", color: "#ee4d2d" },
  Lazada:          { bg: "#eef0ff", color: "#0f146b" },
  "TikTok Shop":   { bg: "#f3f3f3", color: "#010101" },
};



export default function OrderRow({ order }) {
  const statusStyle   = STATUS_COLORS[order.status]   || { bg: "#f0f0f0", color: "#555" };
  const platformStyle = PLATFORM_BADGE[order.platform] || { bg: "#f0f0f0", color: "#555" };

  const st = {
    td: {
      padding: "12px 14px",
      borderBottom: "1px solid #f7f7f7",
      color: "#333",
      fontSize: "13px",
    },
    orderId: {
      padding: "12px 14px",
      borderBottom: "1px solid #f7f7f7",
      color: "#e85d04",
      fontWeight: "600",
      fontSize: "13px",
    },
    amountTd: {
      padding: "12px 14px",
      borderBottom: "1px solid #f7f7f7",
      color: "#333",
      fontWeight: "600",
      fontSize: "13px",
    },
    dateTd: {
      padding: "12px 14px",
      borderBottom: "1px solid #f7f7f7",
      color: "#888",
      fontSize: "13px",
    },
    badge: (bg, color) => ({
      display: "inline-block",
      background: bg,
      color,
      padding: "3px 10px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "600",
    }),
  };

  return (
    <tr>
      <td style={st.orderId}>{order.id}</td>
      <td style={st.td}>{order.customer}</td>
      <td style={st.td}>
        <span style={st.badge(platformStyle.bg, platformStyle.color)}>
          {order.platform}
        </span>
      </td>
      <td style={st.td}>{order.product}</td>
      <td style={st.amountTd}>{order.amount}</td>
      <td style={st.td}>
        <span style={st.badge(statusStyle.bg, statusStyle.color)}>
          {order.status}
        </span>
      </td>
      <td style={st.dateTd}>{order.date}</td>
    </tr>
  );
}