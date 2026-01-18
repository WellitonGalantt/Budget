export function isValidStatusBudget(status: string): boolean {
  switch (status) {
    case "draft":
      return true;
      break;
    case "sent":
      return true;
      break;
    case "approved":
      return true;
      break;
    case "rejected":
      return true;
      break;
    case "canceled":
      return true;
      break;
    default:
      return false;
  }
}
