
import './styles/main.scss';

//variables ===================================================
const table = document.getElementById('configTable');
const doneBtn = document.getElementById('doneBtn');
const url = 'http://www.mocky.io/v2/5d2244d12f00000b66c463e1';
const searchBox = document.querySelector('.search-box');

//event listeners ===============================================
doneBtn.addEventListener('click', submitConfig);

searchBox.addEventListener('keyup', filterQuery);

//utility functions ===========================================

function createNode(element) {
    return document.createElement(element); // Create the type of element you pass in the parameters
}

function append(parent, el) {
    return parent.appendChild(el); // Append the second parameter(element) to the first one
}

function FetchTableData(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let data = json.config;
            //console.log(data);
            data.forEach(element => {
                //  Create the elements meeded
                let fieldLabel = element.label;
                let fieldType = element.field.type;
                let fieldVal = element.field.defaultValue;
                let fieldOptions = element.field.options;
                let fieldDesc = element.description;
                let fieldSelected = element.selected;
                let fieldKey = element.key;

                let newField, option;

                if (fieldType === 'text') {
                    // newField = `<input type = "text" value = "${fieldVal}"`;
                    newField = createNode('input');
                    newField.type = 'text';
                    newField.value = fieldVal;

                } else {
                    newField = createNode('select');
                    fieldOptions.forEach(opt => {
                        option = createNode('option');
                        option.innerHTML = opt;
                        append(newField, option);
                    });
                }

                let tr = createNode('tr');

                //checkbox col
                let checkField = createNode('input');
                checkField.type = 'checkbox';
                checkField.checked = fieldSelected;
                checkField.className = 'filter-box';

                //1st col
                let td1 = createNode('td');
                td1.className = 'col-1';
                td1.innerHTML = fieldLabel;
                append(td1, checkField);
                append(tr, td1);

                //2nd col
                newField.className = 'input-value ';
                append(tr, newField);

                //3rd col
                let td3 = createNode('td');
                td3.innerHTML = fieldDesc;
                append(tr, td3);

                tr.setAttribute('data-value', fieldKey);
                append(table, tr);

                //logic
                if (!fieldSelected) {
                    newField.disabled = true;
                }
            });

        });
}

function submitConfig() {

    let textinputs = table.querySelectorAll('input[type=checkbox]');
    let checked = [].filter.call(textinputs, function (el) {
        return el.checked;
    });
    payload(checked);
}

function payload(selectedElements) {
    let payload = {};
    selectedElements.forEach(el => {
        let key = el.parentNode.parentNode.getAttribute('data-value');
        let value = el.parentNode.parentNode.querySelector('.input-value ').value;
        payload[key] = value;
    });
    console.log(payload);
}


function filterQuery() {
    let filter, col, txtValue;
    filter = searchBox.value.toUpperCase();
    col = document.querySelectorAll('.col-1');

    col.forEach(cell => {
        txtValue = cell.textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            cell.parentNode.style.display = "";
        } else {
            cell.parentNode.style.display = "none";
        }
    });
}


FetchTableData(url);

