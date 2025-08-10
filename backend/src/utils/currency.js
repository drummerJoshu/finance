// Helper for formatting currency in KSH
module.exports = function formatKSH(amount) {
  return `KSH ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
};
