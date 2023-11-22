export function formatCountToKilos(number) {
  if (number < 1000) {
    return number.toString(); // Return the number as is if it's less than 1000
  } else if (number < 2e3) {
    return (number / 1e3).toFixed(1) + "k"; // Convert to thousands and add 'k' with one decimal point
  } else if (number < 1e6) {
    return Math.floor(number / 1e3) + "k"; // Convert to thousands and add 'k' without decimal points
  } else if (number >= 1e6 && number < 1e9) {
    return Math.floor(number / 1e6) + "M"; // Convert to millions and add 'M' without decimal points
  } else if (number >= 1e9 && number < 1e12) {
    return Math.floor(number / 1e9) + "B"; // Convert to billions and add 'B' without decimal points
  } else {
    return number.toExponential(2); // Use exponential notation for larger numbers
  }
}

export function formatCountToIndian(number) {
  const x = number.toString();
  const lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);

  if (otherNumbers !== "") {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    return lastThree;
  }
}
