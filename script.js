// Object with each operator function
const operations = {
    add: function(x, y) {
        return x + y;
    },

    subtract: function(x, y) {
        return x - y;
    },

    multiply: function(x, y) {
        return x * y;
    },

    divide: function(x, y) {
        return x / y;
    },

    modulus: function(x, y) {
        return x % y;
    },

    sqrt: function(x) {
        return Math.sqrt(x);
    }
};

// References to HTML elements
const digitButtons = document.querySelectorAll("button.digit");
const decimalButton = document.getElementById(".");
const operatorButtons = document.querySelectorAll("button.operator");
const displayValue = document.getElementById("display-value");
const displayOperation = document.getElementById("display-operation");
const equalsButton = document.getElementById("equals");
const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");
const plusMinusButton = document.getElementById("plus-minus");

// Other global variables
let isDecimalAccepted = "yes";
let currentValue = "";
let num1;
let operator;
let sqrtOperator;
let num2;
let nextOperator;
let num3;
let result;

// Function to update currentValue and isDecimalAccepted when digit is clicked
function selectDigit(digit) {
    const isDecimal = digit === ".";

    updateCurrentValue(digit);
    if (isDecimal) isDecimalAccepted = "no";
};

// Function to update and display currentValue as digits are entered
function updateCurrentValue(digit) {
    const isDisplayOperationBlank = displayOperation.textContent === "";
    const isOperatorDefined = operator != undefined;
    const isSqrtOperatorDefined = sqrtOperator != undefined;

    currentValue += digit;

    if (!isDisplayOperationBlank && !isOperatorDefined && !isSqrtOperatorDefined) displayOperation.textContent = currentValue;
    displayValue.textContent = currentValue;
};

// Function to set first number in the calculator operation when operator is selected
function setNum1(operatorId) {
    const isCurrentValueBlank = currentValue === "";
    const isThisOperatorSqrt = operatorId === "sqrt";
    const isResultDefined = result != undefined;

    if (isCurrentValueBlank) {
        if (isResultDefined) {
            num1 = result;
            updateCurrentValue(Number(num1.toFixed(8)).toString());
        } else if (!isThisOperatorSqrt) {
            num1 = 0;
            updateCurrentValue("0");
        };
    } else if (!isCurrentValueBlank) {
        num1 = Number(currentValue);
    };
};

// Function to set operator in the calculator operation when operator is selected
function setOperator(operatorId, operatorDisplay) {
    const isThisOperatorSqrt = operatorId === "sqrt";

    if (isThisOperatorSqrt) {
        setSqrtOperator(operatorId, operatorDisplay);
    } else {
        operator = operatorId;
    };
    displayOperation.textContent = currentValue + " " + operatorDisplay;

    currentValue = "";
    isDecimalAccepted = "yes";
};

// Function to set sqrtOperator in the calculator operation when sqrt operator is selected
function setSqrtOperator(operatorId, operatorDisplay) {
    const isNum1Defined = num1 != undefined;
    const isOperatorDefined = operator != undefined;
    const isCurrentValueBlank = currentValue === "";

    sqrtOperator = operatorId;

    if (isNum1Defined && !isOperatorDefined) {
        operator = "multiply";
        displayOperation.textContent += " " + operatorDisplay;
    } else if (!isCurrentValueBlank) {
        num2 = Number(currentValue);
        displayOperation.textContent += " " + currentValue + " " + operatorDisplay;
        currentValue = "";
    } else {
        displayOperation.textContent += " " + operatorDisplay;
    };
};

// Function to set second (or third) number in the calculator operation when "equals" or another operator is selected
    // and call the getResult() function
function setNum2(operatorId) {
    const isEqualsSelected = operatorId === "equals";
    const isNum2Defined = num2 != undefined;

    if (isNum2Defined) {
        num3 = Number(currentValue);
    } else {
        num2 = Number(currentValue);
    };

    if (!isEqualsSelected) nextOperator = operatorId;
    getResult();

    currentValue = "";
    isDecimalAccepted = "yes";
};

// Function to get the result by calling the relevant operation
function getResult() {
    const isNum1Defined = num1 != undefined;
    const isSqrtOperatorDefined = sqrtOperator != undefined;
    const isNum3Defined = num3 != undefined;

    if (!isNum1Defined) {   // operation is sqrt of num2
        if (num2 < 0) {
            alert("You cannot get the square root of a negative number!");
            num2 = null;
            result = null;
        } else {
            result = operations[sqrtOperator](num2);
        };
    } else if (!isSqrtOperatorDefined) {   // operation is operator of num1 and num2
        if (operator === "divide" && num2 === 0) {
            alert("You cannot divide by zero!");
            num2 = null;
            result = null;
        } else {
            result = operations[operator](num1, num2);
        };
    } else if (!isNum3Defined) {    // operation is operator of num1 and (sqrt of num2)
        if (num2 < 0) {
            alert("You cannot get the square root of a negative number!");
            num2 = null;
            result = null;
        } else if (operator === "divide" && num2 === 0) {
            alert("You cannot divide by zero!");
            num2 = null;
            result = null;
        } else {
            let intermediate = operations[sqrtOperator](num2);
            result = operations[operator](num1, intermediate);
        };
    } else {    // operation is operator of num1 and (num2 multiplied by sqrt of num3)
        if (num3 < 0) {
            alert("You cannot get the square root of a negative number!");
            num3 = null;
            result = null;
        } else if (operator === "divide" && num3 === 0) {
            alert("You cannot divide by zero!");
            num3 = null;
            result = null;
        } else {
            let intermediate1 = operations[sqrtOperator](num3);
            let intermediate2 = operations["multiply"](num2, intermediate1);
            result = operations[operator](num1, intermediate2);
        };
    };
};

// Function to display result when "equals" or another operator is selected
    // and reset and redefine variables
function displayResult(buttonId, buttonDisplay) {
    const isEqualsSelected = buttonId === "equals";
    const isNum3Defined = num3 != undefined;
    const isResultDefined = result != undefined;

    if (isResultDefined) {
        if (isEqualsSelected) {
            if (isNum3Defined) {
                displayOperation.textContent += " " + Number(num3.toFixed(8)).toString() + " " + "=";
            } else {
                displayOperation.textContent += " " + Number(num2.toFixed(8)).toString() + " " + "=";
            };
            num1 = null;
            operator = null;
        } else {
            displayOperation.textContent = Number(result.toFixed(8)).toString() + " " + buttonDisplay;
            num1 = result;
            operator = nextOperator;
        };
        
        displayValue.textContent = Number(result.toFixed(10)).toString();
        sqrtOperator = null;
        num2 = null;
        num3 = null;
    } else {
        displayValue.textContent = ""
    };
};

// Function to delete the last digit entered when the DELETE button is clicked (and a number is being entered)
function deleteLastDigit() {
    const lastDigit = currentValue.substring(currentValue.length - 1, currentValue.length);
    const isDisplayValueBlank = displayValue.textContent === "";

    if (lastDigit === ".") isDecimalAccepted = "yes";
    currentValue = currentValue.substring(0, currentValue.length - 1);

    if (!isDisplayValueBlank) {
        displayValue.textContent = currentValue;
    } else {
        displayOperation.textContent = currentValue;
    };
};

// Function to delete the last operator when the DELETE button is clicked (and an operator was last entered)
function deleteLastOperator() {
    const isSqrtOperatorDefined = sqrtOperator != undefined;
    const isNum1Defined = num1 != undefined;

    if (!isSqrtOperatorDefined) {
        operator = null;
        if (isNum1Defined) {
            currentValue = num1.toString();
            num1 = null;
            if (currentValue.includes(".") === true) isDecimalAccepted = "no";
        };
    } else {
        sqrtOperator = null;
    };

    let operationStr = displayOperation.textContent;
    operationStr = operationStr.substring(0, operationStr.length - 2);
    displayOperation.textContent = operationStr;
};

// Function to reset all data (stored values and display) when the CLEAR button is clicked
function clearData() {
    isDecimalAccepted = "yes";
    currentValue = "";
    operator = null;
    sqrtOperator = null;
    num1 = null;
    num2 = null;
    nextOperator = null;
    num3 = null;
    result = null;

    displayValue.textContent = "";
    displayOperation.textContent = "";
};

// Function to change sign of the data when the plus-minus button is clicked
function changeSign() {
    const isCurrentValueBlank = currentValue === "";
    const isDisplayOperationBlank = displayOperation.textContent === "";
    const isOperatorDefined = operator != undefined;
    const isCurrentValueNegative = currentValue.includes("-");
    const isSqrtOperatorDefined = sqrtOperator != undefined;

    if (!isCurrentValueBlank) {
        if (isCurrentValueNegative) {
            currentValue = currentValue.substring(1);
        } else {
            currentValue = "-" + currentValue;
        };
        if (!isDisplayOperationBlank && !isOperatorDefined && !isSqrtOperatorDefined) displayOperation.textContent = currentValue;
    } else {
        currentValue = "-";
    };

    displayValue.textContent = currentValue;
};


// Add event listener (click) to each digit button
function makeDigitsClickable() {
    digitButtons.forEach((digitButton => {
        digitButton.addEventListener("click", () => {
            const isDecimal = digitButton.id === ".";

            if (isDecimal && isDecimalAccepted === "no") {
                return;
            } else {
                selectDigit(digitButton.id);
            };
        });
    }));
};

// Add an event listener (click) to each operator button
function makeOperatorsClickable() {
    operatorButtons.forEach((operatorButton => {
        operatorButton.addEventListener("click", () => {
            const isOperatorDefined = operator != undefined;
            const isSqrtOperatorDefined = sqrtOperator != undefined;
            const isThisOperatorSqrt = operatorButton.id === "sqrt";
            const isCurrentValueBlank = currentValue === "";

            if (!isOperatorDefined && !isSqrtOperatorDefined) {
                setNum1(operatorButton.id);
                setOperator(operatorButton.id, operatorButton.textContent);
            } else if (!isSqrtOperatorDefined && isThisOperatorSqrt) {
                setSqrtOperator(operatorButton.id, operatorButton.textContent);
            } else if (!isCurrentValueBlank) {
                setNum2(operatorButton.id);
                displayResult(operatorButton.id, operatorButton.textContent);
            };
        });
    }));
};

// Add an event listener (click) to the equals button
function makeEqualsClickable() {
    equalsButton.addEventListener("click", () => {
        const isCurrentValueBlank = currentValue === "";
        const isOperatorDefined = operator != undefined;
        const isSqrtOperatorDefined = sqrtOperator != undefined;
        
        if ((isOperatorDefined || isSqrtOperatorDefined) && !isCurrentValueBlank) {
            setNum2(equalsButton.id);
            displayResult(equalsButton.id, equalsButton.textContent);
        };
    });
};

// Add an event listener (click) to the DELETE button
function makeDeleteClickable() {
    deleteButton.addEventListener("click", () => {
        const isCurrentValueBlank = currentValue === "";
        const isOperatorDefined = operator != undefined;
        const isSqrtOperatorDefined = sqrtOperator != undefined;

        if (!isCurrentValueBlank) {
            deleteLastDigit();
        } else if (isCurrentValueBlank && (isOperatorDefined || isSqrtOperatorDefined)) {
            deleteLastOperator();
        };
    });
};

// Add an event listener (click) to the CLEAR button
function makeClearClickable() {
    clearButton.addEventListener("click", () => {
        clearData();
    });
};

// Add an event listener (click) to the plus-minus button
function makePlusMinusClickable() {
    plusMinusButton.addEventListener("click", () => {
        changeSign();
    });
};


// Initialization
makeDigitsClickable();
makeOperatorsClickable();
makeEqualsClickable();
makeDeleteClickable();
makeClearClickable();
makePlusMinusClickable();