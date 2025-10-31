"use strict";

//Import data file
const response = await fetch("Data/Nutrition.json");
const data = await response.json();

//Create single row from data
let table = document.querySelector('table');
let createRow = function(obj, index) {
    let row = document.createElement('tr');
    let ind = document.createElement('th');
    ind.textContent = index;

    row.append(ind);

    for (let key in obj) {
        let cell = document.createElement('td');
        cell.textContent = obj[key];
        row.append(cell);
    }

    table.append(row);
}

//Populate and clear table rows
let populateTable = function(data) {
    let index = 0;
        for (let elem of data)
            createRow(elem, index++);

}
let clearTable = function() {
    while(table.rows.length > 1){
        table.deleteRow(1);
    }
}

populateTable(data);

//Filter table from form input
let filter = {Name:"", Channels:[], Temp:"", Tonifies:[], Properties:[]};
let filterForm = document.getElementById('filter');
filterForm.addEventListener('input', function(event) {
    if (event.target.id === 'name') {
        filter.Name = event.target.value;
    }
    else if (event.target.id === 'channels') {
        filter.Channels = [];
        for (let option of event.target.options)
            if (option.selected)
            filter.Channels.push(option.value);
    }
    else if (event.target.name === 'temp') {
        filter.Temp = event.target.value;
    }
    else if (event.target.matches('div#tonifies input')) {
        if (event.target.checked) {
            if (!filter.Tonifies.includes(event.target.value))
                filter.Tonifies.push(event.target.value);
        } else {
            let ind = filter.Tonifies.indexOf(event.target.value);
            if (ind !== -1)
                filter.Tonifies.splice(ind, 1);
        }
    }
    else if (event.target.id === 'properties') {
        filter.Properties = [];
        for (let option of event.target.options)
            if (option.selected)
                filter.Properties.push(option.value);
    }

    displayData(filter);

})

//Repopulate table
let displayData = function(filter) {
    clearTable();
    populateTable(data.filter(element => {
        return element.Name.toLowerCase().includes(filter.Name.toLowerCase()) &&
            filter.Channels.every(elem => element.Channels.toLowerCase().includes(elem.toLowerCase())) &&
            element.Temp.toLowerCase().includes(filter.Temp.toLowerCase()) &&
            filter.Tonifies.every(elem => element.Tonifies.toLowerCase().includes(elem.toLowerCase())) &&
            filter.Properties.every(elem => element.Properties.toLowerCase().includes(elem.toLowerCase()))
    }));
}

//Sort table
let sortForm = document.getElementById('sort');
sortForm.addEventListener('change', (event) => {
    if (event.target.id === "ascending"){
        data.sort((a,b) => a.Channels.split(",").length - b.Channels.split(",").length)
    } else if (event.target.id === "descending"){
        data.sort((a,b) => b.Channels.split(",").length - a.Channels.split(",").length);
    }

    displayData(filter);
})

filterForm.form.addEventListener('submit', event => event.preventDefault());

//Form buttons
document.querySelector('input#name + input').onclick = function () {
    let name = document.getElementById('name')
    name.value = ""
    name.dispatchEvent(new Event('input', {bubbles: true}));
};
document.querySelector('#reset').onclick = () => {
    filter = {Name:"", Channels:[], Temp:"", Tonifies:[], Properties:[]};
    filterForm.dispatchEvent(new Event('input'));
}

//Buttons
document.getElementById('theme').addEventListener('click', function() {
    document.body.classList.toggle('theme_black');
    filterForm.classList.toggle('theme_black');
    sortForm.classList.toggle('theme_black');
})

document.getElementById('top').addEventListener('click', function(){
    location.href = "#filter";
})

// document.querySelector('div#radio input').onclick = (event) => {if (event.target.checked) event.target.checked = false;};
// document.querySelector('div#radio').addEventListener('click', function (event) {
//     if (event.target.type === 'radio') {
//         if (event.target.checked) {
//             if (event.target.wasChecked) {
//                 event.target.checked = false;
//             }
//             event.target.wasChecked = !event.target.wasChecked;
//         }
//     }
// });