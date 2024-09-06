window.location.href = "#home";
document.querySelector('#form-zip').addEventListener('submit', fetchZipDetails);
document.querySelector('#form-branch').addEventListener('submit', fetchBranchDetails);
function fetchZipDetails(e){
    e.preventDefault();
    document.querySelector('#heading-zip').innerHTML = '';
    document.querySelector('#output-zip').innerHTML = '';
    document.getElementById('zip').classList.remove("is-invalid");
    var zip = document.getElementById('zip').value;
    if(zip != ''){
        fetch(`https://api.postalpincode.in/pincode/${zip}`)
        .then(response => response.json())
        .then(data => {
            if(data[0].Status === 'Success'){
                
                printZipDetails(data,zip);
            }
            else{
                document.querySelector('#zip').classList.add("is-invalid");
                ele = document.querySelector("#validation-zip");
                ele.classList.add("invalid-feedback");
                ele.innerHTML = "Enter valid pincode!";

            }
        });
    }
}

function printZipDetails(data,zip){
    document.querySelector('#heading-zip').innerHTML = data[0].Message;
    
    output = '';    
    data[0].PostOffice.forEach(office => {
        output += `<div class="col mb-4">
                        <div class="card bg-dark text-white h-100 w-70">
                            <div class="card-body">
                                <h5 lass="card-title">Post office : ${office.Name}</h5>
                                <dl class="row">
                                    <dt class="col-sm-3">Branch Type : </dt>
                                    <dd class="col-sm-9">${office.BranchType}</dd>
                                    <dt class="col-sm-3">Delivery Status : </dt>
                                    <dd class="col-sm-9">${office.DeliveryStatus}</dd>
                                    <dt class="col-sm-3">State : </dt>
                                    <dd class="col-sm-9">${office.State}</dd>
                                    <dt class="col-sm-3">District : </dt>
                                    <dd class="col-sm-9">${office.District}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>`
    });

    document.querySelector('#output-zip').innerHTML = output;
    
}

function fetchBranchDetails(e){
    e.preventDefault();
    var branch = document.querySelector('#zbranch').value;
    document.querySelector('#heading-branch').innerHTML = '';
    document.querySelector('#output-branch').innerHTML = '';
    document.getElementById('zbranch').classList.remove("is-invalid");
    if(branch != ''){
        fetch(`https://api.postalpincode.in/postoffice/${branch}`)
        .then(response => response.json())
        .then(data => {
            if(data[0].Status === 'Success'){
                printBranchDetails(data,branch);
            }else{
                document.querySelector('#zbranch').classList.add("is-invalid");
                ele = document.querySelector("#validation-branch");
                ele.classList.add("invalid-feedback");
                ele.innerHTML = "Enter valid branch name!";
            }
        });
    }
}

function printBranchDetails(data,branch){
    document.querySelector('#heading-branch').innerHTML = data[0].Message;
    output = '';    
    data[0].PostOffice.forEach(office => {
        output += `<div class="col mb-4">
                        <div class="card bg-info text-white h-100 w-70">
                            <div class="card-body">
                                <h5 lass="card-title">Post office : ${office.Name}</h5>
                                <dl class="row">
                                    <dt class="col-sm-3">Pincode : </dt>
                                    <dd class="col-sm-9">${office.Pincode}</dd>
                                    <dt class="col-sm-3">BranchType : </dt>
                                    <dd class="col-sm-9">${office.BranchType}</dd>
                                    <dt class="col-sm-3">State : </dt>
                                    <dd class="col-sm-9">${office.State}</dd>
                                    <dt class="col-sm-3">District : </dt>
                                    <dd class="col-sm-9">${office.District}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>`
    });

    document.querySelector('#output-branch').innerHTML = output;
    
}

// Global variable to hold the map
let map;

// Initialize the map with default settings
function initMap() {
    const india = { lat: 20.5937, lng: 78.9629 }; // Default center of India
    map = new google.maps.Map(document.getElementById('map'), {
        center: india,
        zoom: 5
    });
}

// Function to display a marker at the location on the map
function showLocationOnMap(lat, lng) {
    const location = { lat: lat, lng: lng };
    map.setCenter(location);
    map.setZoom(15);  // Zoom in to the post office location

    // Add a marker at the location
    new google.maps.Marker({
        position: location,
        map: map
    });
}

// Geocode the branch name to get the coordinates
function geocodeBranch(branch) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: branch }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            showLocationOnMap(lat, lng);  // Display the location on the map
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// Modify the existing fetchBranchDetails function to trigger geocoding
function fetchBranchDetails(e) {
    e.preventDefault();
    var branch = document.querySelector('#zbranch').value;
    document.querySelector('#heading-branch').innerHTML = '';
    document.querySelector('#output-branch').innerHTML = '';
    document.getElementById('zbranch').classList.remove("is-invalid");
    if (branch != '') {
        fetch(`https://api.postalpincode.in/postoffice/${branch}`)
        .then(response => response.json())
        .then(data => {
            if (data[0].Status === 'Success') {
                printBranchDetails(data, branch);
                geocodeBranch(branch);  // Call geocoding to get the map location
            } else {
                document.querySelector('#zbranch').classList.add("is-invalid");
                ele = document.querySelector("#validation-branch");
                ele.classList.add("invalid-feedback");
                ele.innerHTML = "Enter valid branch name!";
            }
        });
    }
}
