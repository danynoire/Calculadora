const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let expression = "";
let shouldReset = false;

function updateDisplay() {
  display.value = expression || "0";
}

function appendValue(value) {
  if (shouldReset) {
    expression = "";
    shouldReset = false;
  }

  if (value === "." && expression.includes(".")) {
    const lastOperatorIndex = Math.max(
      expression.lastIndexOf("+"),
      expression.lastIndexOf("-"),
      expression.lastIndexOf("*"),
      expression.lastIndexOf("/")
    );

    const currentNumber = expression.slice(lastOperatorIndex + 1);
    if (currentNumber.includes(".")) return;
  }

  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = "";
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    let safeExpression = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/%/g, "/100");
    const result = Function(`"use strict"; return (${safeExpression})`)();
    expression = Number.isFinite(result) ? String(result) : "Erro";
    shouldReset = true;
    updateDisplay();
  } catch {
    expression = "Erro";
    shouldReset = true;
    updateDisplay();
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    if (value === "C") {
      clearAll();
      return;
    }

    if (value === "DEL") {
      deleteLast();
      return;
    }

    if (value === "=") {
      calculate();
      return;
    }

    if (["+", "-", "*", "/", "%"].includes(value)) {
      if (!expression) return;
      const lastChar = expression.slice(-1);
      if (["+", "-", "*", "/", "%"].includes(lastChar)) {
        expression = expression.slice(0, -1);
      }
      expression += value;
      updateDisplay();
      return;
    }

    appendValue(value);
  });
});

updateDisplay();
