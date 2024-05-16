document.addEventListener("DOMContentLoaded", function () {
  // Referencias al formulario y áreas donde se mostrarán los resultados y registros guardados
  const form = document.getElementById("myForm");
  const calculationResultDiv = document.getElementById("calculationResult");
  const savedRecordsDiv = document.getElementById("savedRecords");
  const ageInput = document.getElementById("age");
  const adultInfoDiv = document.getElementById("adultInfo");

  // Mostrar u ocultar la información del tutor legal según la edad del candidato
  ageInput.addEventListener("change", function () {
    const age = parseInt(ageInput.value, 10);
    adultInfoDiv.style.display = age < 18 ? "block" : "none";
  });

  // Escuchar el evento 'submit' del formulario
  form.addEventListener("submit", function (event) {
    // Prevenir el comportamiento por defecto del formulario
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const grade = parseInt(document.getElementById("grade").value, 10);
    const membership = document.getElementById("membership").value;
    const apparel = document.getElementById("apparel").checked;
    const isPreviousStudent =
      document.getElementById("previousStudent").checked;
    const isCashPayment = document.getElementById("cashPayment").checked;

    // Calcular el precio base según el tipo de membresía
    let price = membership === "mensual" ? 25 : 250;

    // Aplicar descuentos acumulados si el pago es en efectivo
    let accumulatedDiscount = 0;
    if (isCashPayment) {
      accumulatedDiscount = calculateAccumulatedDiscount(
        price,
        grade,
        membership,
        isPreviousStudent,
        apparel
      );
    }
    price -= accumulatedDiscount;

    // Mostrar el resultado del cálculo en la página web
    const resultHTML = `
      <h2>Resultado del cálculo:</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Precio Total:</strong> $${price.toFixed(2)}</p>
    `;
    calculationResultDiv.innerHTML = resultHTML;

    // Almacenar la información en localStorage
    const formData = {
      name: name,
      email: email,
      grade: grade,
      membership: membership,
      apparel: apparel,
      isPreviousStudent: isPreviousStudent,
      isCashPayment: isCashPayment,
      price: price.toFixed(2),
    };
    saveRecord(formData);

    // Mostrar los registros guardados
    displaySavedRecords();
  });

  // Función para calcular el descuento acumulado
  function calculateAccumulatedDiscount(
    price,
    grade,
    membership,
    isPreviousStudent,
    apparel
  ) {
    let discount = 0;

    // Descuento por haber sido alumno anteriormente
    if (isPreviousStudent) {
      discount += membership === "mensual" ? price * 0.07 : price * 0.12;
    }

    // Descuento por grado/cinturón y por compra de indumentaria solo para el plan anual
    if (membership === "anual") {
      if (grade > 0) {
        discount += grade * (price * 0.05);
      }
      if (apparel) {
        discount += price * 0.05;
      }
    }

    return discount;
  }

  // Función para guardar un registro en localStorage
  function saveRecord(formData) {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.push(formData);
    localStorage.setItem("records", JSON.stringify(records));
  }

  // Función para mostrar los registros guardados
  function displaySavedRecords() {
    const records = JSON.parse(localStorage.getItem("records")) || [];
    savedRecordsDiv.innerHTML = "<h2>Registros Guardados:</h2>";
    records.forEach((record, index) => {
      const recordHTML = `
        <div>
          <h3>Registro ${index + 1}</h3>
          <p><strong>Nombre:</strong> ${record.name}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Precio Total:</strong> $${record.price}</p>
        </div>
      `;
      savedRecordsDiv.innerHTML += recordHTML;
    });
  }

  // Mostrar los registros guardados al cargar la página
  displaySavedRecords();
});
