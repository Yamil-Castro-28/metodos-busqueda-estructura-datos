const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setStatus(node, message, type = "") {
  node.textContent = message;
  node.className = `status ${type}`.trim();
}

function renderArray(container, values) {
  container.style.setProperty("--cells", values.length);
  container.replaceChildren(...values.map((value, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = index;
    cell.innerHTML = `<small>i=${index}</small><span>${value}</span>`;
    return cell;
  }));
}

function initSequential() {
  const array = [34, 7, 23, 89, 12, 45, 66];
  const board = document.querySelector("#sequential-array");
  if (!board) return;
  const input = document.querySelector("#sequential-target");
  const next = document.querySelector("#sequential-next");
  const auto = document.querySelector("#sequential-auto");
  const reset = document.querySelector("#sequential-reset");
  const status = document.querySelector("#sequential-status");
  const comparisons = document.querySelector("#sequential-comparisons");
  const position = document.querySelector("#sequential-position");
  let index = 0;
  let running = false;
  let done = false;

  const clean = () => {
    renderArray(board, array);
    index = 0;
    running = false;
    done = false;
    comparisons.textContent = "0";
    position.textContent = "—";
    setStatus(status, "Escribe un valor y avanza comparación por comparación.");
    next.disabled = false;
    auto.disabled = false;
  };

  const step = () => {
    if (done) return true;
    const target = Number.parseInt(input.value, 10);
    if (!Number.isFinite(target)) {
      setStatus(status, "Introduce un número para comenzar.", "error");
      return true;
    }
    const cells = [...board.children];
    cells.forEach((cell, i) => {
      cell.classList.remove("current");
      if (i < index) cell.classList.add("checked");
    });
    if (index >= array.length) {
      setStatus(status, `${target} no está en la lista. Se revisaron ${array.length} elementos.`, "error");
      done = true;
      next.disabled = true;
      auto.disabled = true;
      return true;
    }
    const cell = cells[index];
    cell.classList.add("current");
    comparisons.textContent = String(index + 1);
    if (array[index] === target) {
      cell.classList.remove("current");
      cell.classList.add("found");
      position.textContent = String(index);
      setStatus(status, `Encontrado: ${target} está en el índice ${index}.`, "success");
      done = true;
      next.disabled = true;
      auto.disabled = true;
      return true;
    }
    setStatus(status, `Comparamos ${target} con ${array[index]}. No coinciden; seguimos al índice ${index + 1}.`);
    index += 1;
    return false;
  };

  next.addEventListener("click", step);
  auto.addEventListener("click", async () => {
    if (running || done) return;
    running = true;
    next.disabled = true;
    auto.disabled = true;
    while (!done) {
      const finished = step();
      if (finished) break;
      await wait(650);
    }
    running = false;
    if (!done) {
      next.disabled = false;
      auto.disabled = false;
    }
  });
  reset.addEventListener("click", clean);
  input.addEventListener("change", clean);
  clean();
}

function initBinary() {
  const array = [5, 12, 19, 27, 34, 42, 58, 63, 77, 91];
  const board = document.querySelector("#binary-array");
  if (!board) return;
  const input = document.querySelector("#binary-target");
  const next = document.querySelector("#binary-next");
  const auto = document.querySelector("#binary-auto");
  const reset = document.querySelector("#binary-reset");
  const status = document.querySelector("#binary-status");
  const comparisons = document.querySelector("#binary-comparisons");
  const interval = document.querySelector("#binary-interval");
  let low = 0;
  let high = array.length - 1;
  let comparisonsCount = 0;
  let running = false;
  let done = false;

  const paintRange = () => {
    [...board.children].forEach((cell, i) => {
      cell.className = "cell";
      if (i < low || i > high) cell.classList.add("discarded");
      else cell.classList.add("range");
    });
    interval.textContent = low <= high ? `[${low}, ${high}]` : "vacío";
  };

  const clean = () => {
    renderArray(board, array);
    low = 0;
    high = array.length - 1;
    comparisonsCount = 0;
    running = false;
    done = false;
    comparisons.textContent = "0";
    next.disabled = false;
    auto.disabled = false;
    setStatus(status, "La lista ya está ordenada. Comenzamos con todo el intervalo.");
    paintRange();
  };

  const step = () => {
    if (done) return true;
    const target = Number.parseInt(input.value, 10);
    if (!Number.isFinite(target)) {
      setStatus(status, "Introduce un número para comenzar.", "error");
      return true;
    }
    if (low > high) {
      paintRange();
      setStatus(status, `${target} no está en la lista: el intervalo quedó vacío.`, "error");
      done = true;
      next.disabled = true;
      auto.disabled = true;
      return true;
    }
    paintRange();
    const mid = low + Math.floor((high - low) / 2);
    const cell = board.children[mid];
    cell.classList.add("current");
    comparisonsCount += 1;
    comparisons.textContent = String(comparisonsCount);
    if (array[mid] === target) {
      cell.className = "cell found";
      setStatus(status, `Encontrado: ${target} está en el índice central ${mid}.`, "success");
      done = true;
      next.disabled = true;
      auto.disabled = true;
      return true;
    }
    if (target < array[mid]) {
      setStatus(status, `${target} es menor que ${array[mid]}. Conservamos la mitad izquierda.`);
      high = mid - 1;
    } else {
      setStatus(status, `${target} es mayor que ${array[mid]}. Conservamos la mitad derecha.`);
      low = mid + 1;
    }
    interval.textContent = low <= high ? `[${low}, ${high}]` : "vacío";
    return false;
  };

  next.addEventListener("click", step);
  auto.addEventListener("click", async () => {
    if (running || done) return;
    running = true;
    next.disabled = true;
    auto.disabled = true;
    while (!done) {
      const finished = step();
      if (finished) break;
      await wait(760);
    }
    running = false;
    if (!done) {
      next.disabled = false;
      auto.disabled = false;
    }
  });
  reset.addEventListener("click", clean);
  input.addEventListener("change", clean);
  clean();
}

function initHash() {
  const size = 11;
  const initial = [22, 41, 53, 46, 30, 13];
  const table = document.querySelector("#hash-table");
  if (!table) return;
  const input = document.querySelector("#hash-key");
  const insert = document.querySelector("#hash-insert");
  const search = document.querySelector("#hash-search");
  const reset = document.querySelector("#hash-reset");
  const status = document.querySelector("#hash-status");
  const operations = document.querySelector("#hash-operations");
  const load = document.querySelector("#hash-load");
  let slots = Array(size).fill(null);
  let opCount = 0;

  const place = (key) => {
    let index = key % size;
    for (let probes = 0; probes < size; probes += 1) {
      if (slots[index] === null) {
        slots[index] = key;
        return;
      }
      index = (index + 1) % size;
    }
  };
  initial.forEach(place);

  const render = (classes = {}) => {
    table.replaceChildren(...slots.map((value, index) => {
      const cell = document.createElement("div");
      cell.className = `hash-slot ${classes[index] || ""}`.trim();
      cell.innerHTML = `<span class="slot-index">${index}</span><span>${value ?? "—"}</span>`;
      return cell;
    }));
    load.textContent = `${slots.filter((v) => v !== null).length}/${size}`;
    operations.textContent = String(opCount);
  };

  const getKey = () => {
    const key = Number.parseInt(input.value, 10);
    if (!Number.isFinite(key) || key < 0 || key > 999) {
      setStatus(status, "Escribe una clave entera entre 0 y 999.", "error");
      return null;
    }
    return key;
  };

  const run = async (mode) => {
    const key = getKey();
    if (key === null) return;
    insert.disabled = true;
    search.disabled = true;
    let index = key % size;
    const visited = {};
    setStatus(status, `Calculamos h(${key}) = ${key} mod ${size} = ${index}.`);
    for (let probes = 0; probes < size; probes += 1) {
      visited[index] = slots[index] === null ? "current" : "collision";
      render(visited);
      await wait(650);
      opCount += 1;
      if (mode === "search" && slots[index] === key) {
        visited[index] = "found";
        render(visited);
        setStatus(status, `Clave ${key} encontrada en la posición ${index} después de ${probes + 1} revisión(es).`, "success");
        insert.disabled = false;
        search.disabled = false;
        return;
      }
      if (slots[index] === null) {
        if (mode === "insert") {
          slots[index] = key;
          visited[index] = "found";
          render(visited);
          setStatus(status, `Insertamos ${key} en la posición ${index}.`, "success");
        } else {
          render(visited);
          setStatus(status, `La posición ${index} está vacía; la clave ${key} no está en la tabla.`, "error");
        }
        insert.disabled = false;
        search.disabled = false;
        return;
      }
      if (mode === "insert" && slots[index] === key) {
        visited[index] = "found";
        render(visited);
        setStatus(status, `La clave ${key} ya se encuentra en la posición ${index}.`, "success");
        insert.disabled = false;
        search.disabled = false;
        return;
      }
      setStatus(status, `Colisión en ${index}: contiene ${slots[index]}. Probamos la siguiente posición.`);
      index = (index + 1) % size;
    }
    setStatus(status, "La tabla está llena; no se puede completar la operación.", "error");
    render();
    insert.disabled = false;
    search.disabled = false;
  };

  insert.addEventListener("click", () => run("insert"));
  search.addEventListener("click", () => run("search"));
  reset.addEventListener("click", () => {
    slots = Array(size).fill(null);
    initial.forEach(place);
    opCount = 0;
    render();
    setStatus(status, "La tabla usa h(k) = k mod 11 y sondeo lineal para resolver colisiones.");
  });
  render();
}

function initDecision() {
  const form = document.querySelector("#decision-form");
  if (!form) return;
  const result = document.querySelector("#decision-result");
  const update = () => {
    const sorted = form.elements.sorted.value === "yes";
    const exact = form.elements.exact.value === "yes";
    const repeated = form.elements.repeated.value === "yes";
    let method = "Búsqueda secuencial";
    let reason = "Funciona sin ordenar y sirve para recorridos pequeños u ocasionales.";
    if (exact && repeated) {
      method = "Tabla hash";
      reason = "Las consultas exactas repetidas aprovechan el acceso promedio cercano a O(1).";
    } else if (sorted) {
      method = "Búsqueda binaria";
      reason = "Los datos ordenados permiten descartar la mitad del intervalo en cada paso.";
    }
    result.innerHTML = `<div><span>Elección sugerida</span><br><strong>${method}</strong><p>${reason}</p></div>`;
  };
  form.addEventListener("change", update);
  update();
}

initSequential();
initBinary();
initHash();
initDecision();
