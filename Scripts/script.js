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
    // if (filters) {
    //     for (let elem of data)
    //         if (elem['name'].toLowerCase().includes(filters.name.toLowerCase()))
    //             createRow(elem, index++);
    // }
    // else
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
    else if (event.target.id === 'temp') {
        filter.Temp = event.target.value;
    }
    else if (event.target.id === 'tonifies') {
        filter.Tonifies = [];
        for (let option of event.target.options)
            if (option.selected)
                filter.Tonifies.push(option.value);
    }
    else if (event.target.id === 'properties') {
        filter.Properties = [];
        for (let option of event.target.options)
            if (option.selected)
                filter.Properties.push(option.value);
    }

    //Repopulate table
    clearTable();
    populateTable(data.filter(element =>  {return element.Name.toLowerCase().includes(filter.Name.toLowerCase()) &&
            filter.Channels.every(elem => element.Channels.toLowerCase().includes(elem.toLowerCase())) &&
            element.Temp.toLowerCase().includes(filter.Temp.toLowerCase()) &&
            filter.Tonifies.every(elem => element.Tonifies.toLowerCase().includes(elem.toLowerCase())) &&
            filter.Properties.every(elem => element.Properties.toLowerCase().includes(elem.toLowerCase()))
    }));
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