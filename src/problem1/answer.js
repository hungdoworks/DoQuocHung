/*
  Based on your example's Output, I assume Input will have this constraint: 1 <= n <= Number.MAX_SAFE_INTEGER
*/

var sum_to_n_a = function (n) {
  // your code here
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

var sum_to_n_b = function (n) {
  // your code here
  if (n === 1) return 1;

  return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n) {
  // your code here
  return Array.from(new Array(n).keys())
    .map((num) => num + 1)
    .reduce((t, n) => t + n);
};

console.log("1st way", sum_to_n_a(5));
console.log("2nd way", sum_to_n_b(5));
console.log("3rd way", sum_to_n_c(5));
