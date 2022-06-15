const inputs = document.querySelectorAll('#formulario input, #formulario select'),
    btn_form = document.getElementById("btn"),
    option = document.getElementById("option"),
    mu = document.getElementById("mu"),
    si = document.getElementById("si"),
    x = document.getElementById("x"),
    z = document.getElementById("z"),
    ctx = document.getElementById("chartjs").getContext("2d");

const x_values = [],
    x_eval = [];

let chart;

for (let i = -3; i <= 3; i = i + .01) {
    const x = parseFloat(i.toFixed(2));
    x_values.push(x);
    x_eval.push((1 / Math.sqrt(2 * Math.PI)) * Math.pow(Math.E, -.5 * Math.pow(x, 2)));
}

for (let index = 0; index < inputs.length - 1; index++) {
    const input = inputs[index];
    const label = input.parentNode.firstElementChild;

    input.addEventListener('focus', () => {
        label.classList.add("label__active");
        label.classList.add("label__focus");
        inputs[inputs.length - 1].value = '';
    });

    input.addEventListener('blur', () => {
        label.classList.remove("label__focus");

        if (input.value.length == 0) {
            label.classList.remove("label__active");
        }

        for (let i = 0; i < option.length; i++) {
            const element = option[i];
            if (parseFloat(mu.value) != 0 && parseFloat(si.value) != 1 && i >= 2) {
                element.disabled = true;
            } else {
                element.disabled = false;
            }
        }
    });

    if (input.value.length > 0) {
        label.classList.add("label__active");
    }
}

option.addEventListener('change', () => {

});

btn_form.addEventListener('click', (e) => {
    e.preventDefault();

    const z = inputs[inputs.length - 1],
        label = z.parentNode.firstElementChild;

    label.classList.add("label__active");

    setTimeout(() => {
        dibujarRegion();
    }, 500);
});

graficar();

function graficar() {
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x_values,
            datasets: [
                {
                    label: "x",
                    borderColor: "#5c5c5c",
                    data: x_eval,
                    fill: true,
                    backgroundColor: "#bebebe",
                },
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

}

function dibujarRegion() {
    const xValue = parseFloat(((parseFloat(x.value) - parseFloat(mu.value)) / parseFloat(si.value)).toFixed(2));
    let i = 0;

    while (x_values[i] != xValue) {
        i++;
    }

    const complement = (ctx, value) => {
        if (option.value == '3') {
            if ((Math.sign(x_values[i]) == 1 || Math.sign(x_values[i]) == 0) && ctx.p0.parsed.x < (x_values.length - i)) {
                return value;
            } else if (Math.sign(x_values[i]) == -1 && ctx.p0.parsed.x >= (x_values.length - i)) {
                return value;
            }
        }
    }
    
    const area = (ctx, value) => {
        if (option.value == '1' && ctx.p0.parsed.x >= i) {
            return value;
        } else if (option.value == '2' && ctx.p0.parsed.x < i) {
            return value;
        } else if (option.value == '3') {
            if ((Math.sign(x_values[i]) == 1 || Math.sign(x_values[i]) == 0) && ctx.p0.parsed.x >= i) {
                return value;
            } else if (Math.sign(x_values[i]) == -1 && ctx.p0.parsed.x < i) {
                return value;
            }
        } else if (option.value == '4') {
            if (Math.sign(x_values[i]) == 1 && ctx.p0.parsed.x >= (x_values.length - i) && ctx.p0.parsed.x < i) {
                return value;
            } else if (Math.sign(x_values[i]) == -1 && ctx.p0.parsed.x >= i && ctx.p0.parsed.x < (x_values.length - i)) {
                return value;
            }
        } else {
            return undefined;
        }
    }

    if (chart) {
        chart.clear();
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x_values,
            datasets: [
                {
                    label: "x",
                    borderColor: "#5c5c5c",
                    data: x_eval,
                    fill: true,
                    backgroundColor: "#bebebe",
                    segment: {
                        backgroundColor: ctx => area(ctx, '#e76a6a') || complement(ctx, '#e76a6a')
                    }
                },
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
