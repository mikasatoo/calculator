// "add" operation
const add = function(x, y) {
    return x + y;
}

// "subtract" operation
const subtract = function(x, y) {
    return x - y;
}

// "multiply" operation - !! might need to change this to an array?? !!
const multiply = function(x, y) {
    return x * y;
}

// "divide" operation
const divide = function(x, y) {
    return x / y;
}

// "modulus" operation
const modulus = function(x, y) {
    return x % y;
}

// "sqrt" operation
const sqrt = function(x) {
    return Math.sqrt(x);
}

// Variables for each calculator operation
let num1;       // first number
let operator;   // operator
let num2;       // second number
let result;     // result

// "operate" function
function operate(x, operator, y) {
    return result = operator(x, y);
}

num1 = 3;
num2 = 6;
operator = multiply;
console.log(operate(num1, operator, num2));