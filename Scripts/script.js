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

//Populate table rows with filtered data
let populateTable = function(data) {
    let index = 0;
        for (let elem of data)
            createRow(elem, index++);

}

//Deletes all rows except header
let clearTable = function() {
    while(table.rows.length > 1){
        table.deleteRow(1);
    }
}

populateTable(data);

//Filter Function
//Creates "filter", an object of filters
let filter = {Name:"", Channels:[], Temp:"", Tonifies:[], Properties:[], Type:[], NotType:[]};
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
    else if (event.target.id === "type") {
        filter.Type = [];
        for (let option of event.target.options)
            if (option.selected)
                filter.Type.push(option.value);
    }
    else if (event.target.id === "notType") {
        filter.NotType = [];
        for (let option of event.target.options)
            if (option.selected)
                filter.NotType.push(option.value);
    }

    //Refresh table
    displayData(filter);

});

//Repopulate table
//Clears then populates table with filtered data
//Uses "filter" array to filter the data rows
let displayData = function(filter) {
    clearTable();
    populateTable(data.filter(element => {
        return element.Name.toLowerCase().includes(filter.Name.toLowerCase()) &&
            filter.Channels.every(elem => element.Channels.toLowerCase().includes(elem.toLowerCase())) &&
            element.Temp.toLowerCase().includes(filter.Temp.toLowerCase()) &&
            filter.Tonifies.every(elem => element.Tonifies.toLowerCase().includes(elem.toLowerCase())) &&
            filter.Properties.every(elem => element.Properties.toLowerCase().includes(elem.toLowerCase())) &&
            (filter.Type.length === 0 || filter.Type.some(elem => element.Type.toLowerCase() === elem.toLowerCase())) &&
             (filter.NotType.length === 0 || filter.NotType.every(elem => element.Type.toLowerCase() !== elem.toLowerCase()));
    }));
}

//Sort Function
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

//Clear "Name" input field button
document.querySelector('input#name + input').onclick = function () {
    let name = document.getElementById('name');
    name.value = "";
    name.dispatchEvent(new Event('input', {bubbles: true}));
};

//Reset form button
document.querySelector('#reset').onclick = () => {
    filter = {Name:"", Channels:[], Temp:"", Tonifies:[], Properties:[], Type:[], NotType:[]};
    filterForm.dispatchEvent(new Event('input'));
}

//Button - Theme
document.getElementById('theme').addEventListener('click', function() {
    document.body.classList.toggle('theme_black');
    filterForm.classList.toggle('theme_black');
    sortForm.classList.toggle('theme_black');
})

//Button - Top
document.getElementById('top').addEventListener('click', function(){
    // location.href = "#topRow";
    window.scrollTo(0,0);
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