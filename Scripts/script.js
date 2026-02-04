"use strict";

//Import data file
const response = await fetch("Data/Nutrition.json");
const data = await response.json();


data.forEach(entry => {
    entry.Channels = new Set(entry.Channels.split(','));
    entry.Properties = new Set(entry.Properties.split(','));
    entry.Tonifies = new Set(entry.Tonifies.split(','));
});

// console.log((new Set(['a','b','c'])).isSubsetOf(new Set(['a', 'd', 'e'])));

//Create single row from data
let table = document.querySelector('table');
function createRow(obj, index) {
    let row = document.createElement('tr');
    let ind = document.createElement('th');
    ind.textContent = index;

    row.append(ind);

    for (let key in obj) {
        let cell = document.createElement('td');
        if (obj[key] instanceof Set)
            cell.textContent = [...obj[key]];
        else
            cell.textContent = obj[key];
        row.append(cell);
    }

    table.append(row);
}


//Populate table rows with filtered data
function populateTable(data) {
    let index = 0;
    for (let elem of data)
        createRow(elem, index++);

}

//Deletes all rows except header
function clearTable() {
    while(table.rows.length > 1){
        table.deleteRow(1);
    }
}

//Resets filter
function resetFilter() {
    return {Name:"", Channels:new Set(), Temp:"", Tonifies:new Set(), Properties:new Set(), NotProperties:new Set(), Type:[], NotType:[]};
}

// populateTable(data);

//Filter Function
//Creates "filter", an object of filters
let filter = resetFilter();
let filterForm = document.getElementById('filter');
filterForm.addEventListener('input', function(event) {
    if (event.target.id === 'name') {
        filter.Name = event.target.value;
    }
    else if (event.target.id === 'channels') {
        // filter.Channels = [];
        // for (let option of event.target.options)
        //     if (option.selected)
        //     filter.Channels.push(option.value);

        filter.Channels = new Set();
        for (let option of event.target.options)
            if (option.selected)
                filter.Channels.add(option.value.toLowerCase());
    }
    else if (event.target.name === 'temp') {
        filter.Temp = event.target.value;
    }
    else if (event.target.matches('div#tonifies input')) {
        if (event.target.checked) {
            if (!filter.Tonifies.has(event.target.value))
                filter.Tonifies.add(event.target.value);
        } else {
            filter.Tonifies.delete(event.target.value);
        }
        // if (event.target.checked) {
        //     if (!filter.Tonifies.includes(event.target.value))
        //         filter.Tonifies.push(event.target.value);
        // } else {
        //     let ind = filter.Tonifies.indexOf(event.target.value);
        //     if (ind !== -1)
        //         filter.Tonifies.splice(ind, 1);
        // }
    }
    else if (event.target.id === 'properties') {
        // filter.Properties = [];
        // for (let option of event.target.options)
        //     if (option.selected)
        //         filter.Properties.push(option.value);

        filter.Properties = new Set();
        for (let option of event.target.options)
            if (option.selected)
                filter.Properties.add(option.value.toLowerCase());
        console.log(filter.Properties);
    }
    else if (event.target.id === "type") {
        filter.Type = [];
        for (let option of event.target.options)
            if (option.selected)
                filter.Type.push(option.value);

        // filter.Type = new Set();
        // for (let option of event.target.options)
        //     if (option.selected)
        //         filter.Type.add(option.value.toLowerCase());
    }
    else if (event.target.id === "notType") {
        filter.NotType = [];
        for (let option of event.target.options)
            if (option.selected)
                filter.NotType.push(option.value);


    }
    else if (event.target.id === "notProperties") {
        // filter.NotProperties = [];
        // for (let option of event.target.options)
        //     if (option.selected)
        //         filter.NotProperties.push(option.value);

        filter.NotProperties = new Set();
        for (let option of event.target.options)
            if (option.selected)
                filter.NotProperties.add(option.value);
    }

    //Refresh table
    displayData(filter);

});

//Repopulate table
//Clears then populates table with filtered data
//Uses "filter" array to filter the data rows
function displayData(filter) {
    clearTable();
    populateTable(data.filter(element => {
        // console.log(element.Channels)
        return element.Name.toLowerCase().includes(filter.Name.toLowerCase()) &&
            // filter.Channels.every(elem => element.Channels.toLowerCase().includes(elem.toLowerCase())) &&
            (filter.Channels.size === 0 || setTrimmer(filter.Channels).isSubsetOf(setTrimmer(element.Channels))) &&
            element.Temp.toLowerCase().includes(filter.Temp.toLowerCase()) &&
            // filter.Tonifies.every(elem => element.Tonifies.toLowerCase().includes(elem.toLowerCase())) &&
            (filter.Tonifies.size === 0 || setTrimmer(filter.Tonifies).isSubsetOf(setTrimmer(element.Tonifies))) &&
            // filter.Properties.every(elem => element.Properties.toLowerCase().includes(elem.toLowerCase())) &&
            (filter.Properties.size === 0 || setTrimmer(filter.Properties).isSubsetOf(setTrimmer(element.Properties))) &&
            // !console.log(Boolean(!console.log((filter.Properties.size === 0 || setTrimmer(filter.Properties).isSubsetOf(setTrimmer(element.Properties)))))) &&
            (filter.Type.length === 0 || filter.Type.some(elem => element.Type.toLowerCase().includes(elem.toLowerCase()))) &&
            // (filter.Type.size === 0 || setTrimmer(filter.Type).isSubsetOf(setTrimmer(element.Type)))
            (filter.NotType.length === 0 || filter.NotType.every(elem => !element.Type.toLowerCase().includes(elem.toLowerCase()))) &&
             // (filter.NotProperties.length === 0 || filter.NotProperties.every(elem => element.Properties.toLowerCase().split(',').every(prop => !prop.includes(elem.toLowerCase()))));
            (filter.NotProperties.size === 0 || !setTrimmer(filter.NotProperties).isSubsetOf(setTrimmer(element.Properties)))
    }));
}

//Sort Function
let sortForm = document.getElementById('sort');
sortForm.addEventListener('change', (event) => {
    if (event.target.id === "asc_Type") {
        data.sort((a,b) => a.Type.localeCompare(b.Type));
        // data.sort((a,b) => a.Type.size - b.Type.size);
    } else if (event.target.id === "des_Type") {
        data.sort((a,b) => b.Type.localeCompare(a.Type));
        // data.sort((a,b) => b.Type.size - a.Type.size);
    } else if (event.target.id === "asc_Channels"){
        // data.sort((a,b) => a.Channels.split(",").length - b.Channels.split(",").length);
        data.sort((a,b) => a.Channels.size - b.Channels.size);
    } else if (event.target.id === "des_Channels"){
        // data.sort((a,b) => b.Channels.split(",").length - a.Channels.split(",").length);
        data.sort((a,b) => b.Channels.size - a.Channels.size);
    } else if (event.target.id === "asc_Properties") {
        // data.sort((a,b) => a.Properties.split(",").length - b.Properties.split(",").length);
        data.sort((a,b) => a.Properties.size - b.Properties.size);
    } else if (event.target.id === "des_Properties") {
        // data.sort((a,b) => b.Properties.split(",").length - a.Properties.split(",").length);
        data.sort((a,b) => b.Properties.size - a.Properties.size);
    }

    displayData(filter);
})

filterForm.form.addEventListener('submit', event => event.preventDefault());


filterForm.dispatchEvent(new Event('input'));

function setTrimmer(set) {
    set = [...set].map(x => x.toLowerCase().trim().replace('?', ''));
    set = new Set(set);
    // console.log("Trimmed: ");
    // console.log(set);
    return set;
}

//Clear "Name" input field button
document.querySelector('input#name + input').onclick = function () {
    let name = document.getElementById('name');
    name.value = "";
    name.dispatchEvent(new Event('input', {bubbles: true}));
};

//Reset form button
document.querySelector('#reset').onclick = () => {
    filter = resetFilter();
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