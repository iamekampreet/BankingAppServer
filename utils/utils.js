const invalidCharacterRegex = /[-()\s]/g;

exports.validatePhoneNumber = (phoneNumber) => {
  return phoneNumber.replaceAll(invalidCharacterRegex, "");
};

exports.dateofNextMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilNextMonday = (8 - dayOfWeek) % 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);
  const formattedDate = nextMonday.toISOString().split("T")[0];
  return formattedDate;
};

exports.dateOfFirstDayOfNextMonth = () => {
  const today = new Date();
  const year =
    today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
  const month = (today.getMonth() + 1) % 12;

  return new Date(year, month, 1).toISOString().split("T")[0];
};

exports.isScheduledDateToday = (date) => {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDay() === date.getDay()
  );
};
