export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Education",
  "Health",
  "Salary",
  "Others",
];

export const CATEGORY_COLORS = {
  Food: "#C1432C",
  Transport: "#2F6FED",
  Shopping: "#9A5CC7",
  Entertainment: "#E0A030",
  Bills: "#6B7A73",
  Education: "#1B8A5A",
  Health: "#D24B7B",
  Salary: "#0F5537",
  Others: "#4A5850",
};

export const formatCurrency = (value, currency = "INR") => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
