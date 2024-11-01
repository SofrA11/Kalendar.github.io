let firstTime = true;
export function draw(container){
    let divA4 = document.createElement("div");
    divA4.classList.add("A4");
    //Dobijanje trenutnog meseca i godine
    var date = new Date();
    let monthNow = date.getMonth()+1;
    let yearNow = date.getFullYear();

    drawInput(container, yearNow, monthNow);
    drawTitle(divA4,yearNow, monthNow);

    let divCalBody = document.createElement("div");
    divCalBody.classList.add("divCalendarBody");
    if(firstTime){
        drawCalendar(divCalBody,yearNow,monthNow)
        firstTime=false;
    }
    divA4.appendChild(divCalBody);
    container.appendChild(divA4);

 // Kreiramo dugme u okviru neke funkcije, kao što je draw
let printButton = document.createElement("button"); // Koristimo dugme umesto inputa
printButton.classList.add("button-64");
printButton.setAttribute("role", "button");

// Kreiramo span unutar dugmeta
let span = document.createElement("span");
span.classList.add("text");
span.innerHTML = "Штампај"; // Tekst dugmeta
printButton.appendChild(span);

// Dodajemo funkcionalnost klik događaja za dugme
printButton.onclick = () => exportPDF(); // Poziva funkciju za izvoz PDF-a

// Dodajemo dugme u kontejner
container.appendChild(printButton);

}

async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    // Koristimo querySelector umesto getElementById
    const calendar = document.querySelector(".A4"); // Pretpostavljam da koristite .A4 klasu

    if (!calendar) {
        console.error("Element sa klasom 'A4' ne postoji.");
        return; // Prekinite funkciju ako element ne postoji
    }

    try {
        // Povećavamo kvalitet slike
        const canvas = await html2canvas(calendar, {
            scale: 2, // Povećavamo skalu za bolji kvalitet
            useCORS: true // Omogućava korišćenje CORS za slike iz drugih domena
        });
        
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
        pdf.save("kalendar.pdf");
    } catch (error) {
        console.error('Greška prilikom generisanja PDF-a:', error);
    }
}



function drawTitle(container,year,month){

    let divTitle = document.createElement("div");
    divTitle.classList.add("div-title");

    let divTitleMonth = document.createElement("div");
    let titleMonth = document.createElement("h1");
    titleMonth.innerHTML = getMonthName(month);
    titleMonth.classList.add("monthName");
    divTitleMonth.appendChild(titleMonth);

    let divTitleYear = document.createElement("div");
    let titleYear = document.createElement("h1");
    titleYear.innerHTML = year;
    titleYear.classList.add("yearNumber");
    divTitleYear.appendChild(titleYear);

    divTitle.appendChild(divTitleMonth);
    divTitle.appendChild(divTitleYear);
    container.appendChild(divTitle);
}

function drawCalendar(container, year, month) {
    container.innerHTML = "";

    let table = document.createElement("table");
    table.classList.add("calendar-table");

    const daysOfWeek = ["Понедељак", "Уторак", "Среда", "Четвртак", "Петак", "Субота", "Недеља"];
    let headerRow = document.createElement("tr");

    daysOfWeek.forEach(day => {
        let th = document.createElement("th");
        th.innerText = day;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Prilagodimo prvi dan

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                cell.innerText = "";
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.innerText = date;
                date++;
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
        if (date > daysInMonth) break;
    }

    container.appendChild(table);
}


function drawInput(container, currentYear, currentMonth) {
    let divInput = document.createElement("div");
    divInput.classList.add("div-input"); // Dodajemo klasu za stilizaciju div-a

    let labelYear = document.createElement("label");
    labelYear.style.fontSize="22px"
    labelYear.innerHTML = "Година: ";
    let inputYear = document.createElement("input");
    inputYear.type = "number";
    inputYear.style.fontSize="20px"
    inputYear.min = 2000;
    inputYear.max = 2100;
    inputYear.value = currentYear;
    inputYear.classList.add("input-month");
    divInput.appendChild(labelYear);
    divInput.appendChild(inputYear);

    let labelMonth = document.createElement("label");
    labelMonth.style.fontSize="22px"
    labelMonth.innerHTML = "Месец: ";
    let inputMonth = document.createElement("input");
    inputMonth.type = "number";
    inputMonth.style.fontSize="20px"
    inputMonth.min = 1;
    inputMonth.max = 12;
    inputMonth.value = currentMonth;
    inputMonth.classList.add("input-month");
    divInput.appendChild(labelMonth);
    divInput.appendChild(inputMonth);

        // Kreiramo dugme u okviru neke funkcije, kao što je draw
    let button = document.createElement("button"); // Koristimo dugme umesto inputa
    button.classList.add("button-64");
    button.setAttribute("role", "button");

    // Kreiramo span unutar dugmeta
    let span = document.createElement("span");
    span.classList.add("text");
    span.innerHTML = "Генериши календар";; // Tekst dugmeta
    button.appendChild(span);

    button.onclick = async () => await handleClick(inputYear.value, inputMonth.value - 1); // Prilagodite ovde

    divInput.appendChild(button);

    container.appendChild(divInput);
}


function getMonthName(numMonth) {
    let ime;
    switch(numMonth ) {
        case 1: ime = "Јануар"; break;
        case 2: ime = "Фебруар"; break;
        case 3: ime = "Март"; break;
        case 4: ime = "Април"; break;
        case 5: ime = "Мај"; break;
        case 6: ime = "Јун"; break;
        case 7: ime = "Јул"; break;
        case 8: ime = "Август"; break;
        case 9: ime = "Септембар"; break;
        case 10: ime = "Октобар"; break;
        case 11: ime = "Новембар"; break;
        case 12: ime = "Децембар"; break;
    }
    return ime;
}

async function handleClick(year, month) {
    // Ažuriramo naziv meseca i godine u naslovu
    let mn = document.querySelector(".monthName");
    mn.innerHTML = getMonthName(parseInt(month+1)); // Proveravamo mesec ovde

    let yr = document.querySelector(".yearNumber");
    yr.innerHTML = year;

    let container = document.querySelector(".divCalendarBody");
    container.innerHTML = ""; // Očistimo sadržaj pre ponovnog crtanju
    drawCalendar(container, year, parseInt(month)); // Proveravamo mesec ovde
}


draw(document.body);

export default draw;
