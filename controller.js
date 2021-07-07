var app = angular.module("myApp", []);


app.controller("myCtrl", function ($scope) {
    const distanceThreshold = 13000;
    $scope.hcoList = [];
    $scope.codes = [
        { 'longLbl': "NURSE PRACTITIONER" },
        { 'longLbl': "CERTIFIED NURSE ANESTHETIST" },
        { 'longLbl': "REGISTERED NURSE" },
        { 'longLbl': "LICENSED PRACTICAL NURSE" },
        { 'longLbl': "CLINICAL SOCIAL WORKER" },
        { 'longLbl': "BEHAVIORAL HEALTH & SOCIAL SERVICES" },
        { 'longLbl': "LICENSED VOCATIONAL NURSE" },
        { 'longLbl': "FAMILY MEDICINE" },
        { 'longLbl': "OCCUPATIONAL THERAPY" },
        { 'longLbl': "PHYSICIAN ASSISTANT" },
        { 'longLbl': "ADVANCED REGISTERED NURSE" },
        { 'longLbl': "AUDIOLOGY" },
        { 'longLbl': "UNSPECIFIED" },
        { 'longLbl': "EMERGENCY MEDICINE" },
        { 'longLbl': "CHIROPRACTIC" },
        { 'longLbl': "DIAGNOSTIC RADIOLOGY" },
        { 'longLbl': "GENERAL SURGERY" },
        { 'longLbl': "VASCULAR & INTERVENTIONAL RADIOLOGY" },
        { 'longLbl': "NEONATAL-PERINATAL MEDICINE" },
        { 'longLbl': "PEDIATRICS" }
    ];

    $scope.submitIsEnabled = false;
    $scope.submissionMsg = '';
    $scope.coordinates = {
        lat: '',
        long: ''
    };
    $scope.postInquiry = (index, selectedDoctor) => {
        $scope.selectedDoctor = selectedDoctor;
        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the button that opens the modal
        var btn = document.getElementById(`inquiry${index}`);
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks the button, open the modal 
        btn.onclick = function () {
            modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            setTimeout(() => {
                modal.style.display = "none";
            }, 500);

        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    $scope.enableSubmit = () => {
        const name = document.getElementById('Name');
        const inquiryDetails = document.getElementById('Inquiry');
        if (name || inquiryDetails) {
            $scope.submitIsEnabled = true;
        }
    }


    $scope.submitInquiry = async () => {
        $scope.submissionMsg = "";
        const name = document.getElementById('Name');
        const inquiryDetails = document.getElementById('Inquiry');
        const email = document.getElementById('email');
        const dateTimeDetails = document.getElementById('date-time-picker');
        const dateInfo = dateTimeDetails.value.split('T');
        await $scope.sendEmail({
            dateInfo,
            email : email.value
        });
        $scope.submitIsEnabled = false;
        $scope.submissionMsg = "Submitted Successfully";
        name.value = '';
        inquiryDetails.value = '';
        email.value = '';
        dateTimeDetails.value = '';
    }

    $scope.sendEmail = async ({dateInfo, email}) => {
        const templateObj = {
            email_to: email,
            appName: "Medico",
            to_name: "User",
            Date: dateInfo[0],
            Time: dateInfo[1]
        }

        return emailjs.send('service_ns717ag', 'template_3o59v2m', templateObj).then((response)=>{
            console.log("Email sent Successfully");
        });
    }

    $scope.getMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        function showPosition(position) {
            // lat: 38.6358, lon: -77.2745
            $scope.coordinates.lat = 40.704 ;//position.coords.latitude;
            $scope.coordinates.long = -74.3093 ; //position.coords.longitude;
            console.log(JSON.stringify($scope.coordinates));
        }
    }
    //3001106b821f9048

    //30015ce4de47725d
    $scope.hclAPI = new HclAPI({ apiKey: "30015d4934c30a75" });



    $scope.fetchActivities = async (noOfRecords) => {
        const params = {
            first: noOfRecords,
            offset: 0,
            country: "US"
        };

        $scope.activities = await $scope.hclAPI.activities(params);
        // $scope.activitiesWithDistance = dataset.data.activities.map((record) => {
        //     record.calculatedDistance = Math.round(distance(
        //         $scope.coordinates.lat, $scope.coordinates.long,
        //         record.activity.workplace.address.location.lat,
        //         record.activity.workplace.address.location.lon), 2);
        //     return record;
        // });
        $scope.activitiesWithDistance = $scope.activities.activities.map((record) => {
            record.calculatedDistance = Math.round(distance(
                $scope.coordinates.lat, record.activity.workplace.address.location.lat,
                $scope.coordinates.long, record.activity.workplace.address.location.lon), 2);
            return record;
        });
        $scope.$apply();
    }

    $scope.fetchCodesBylabel = async (noOfRecords) => {
        const params = {
            first: noOfRecords,
            offset: 0,
            codeTypes: ['SP', 'TIT']
        }
        const response = await $scope.hclAPI.codesByLabel(params)
        $scope.codes = response.codesByLabel.codes.map((code) => {
            return {
                'longLbl': code.longLbl
            };
        });
    }

    $scope.searchHcos = () => {
        console.log($scope.selectedCategory);
        const filteredList = $scope.activitiesWithDistance.filter((record) => {
            return _.find(record.activity.individual.specialties, { label: $scope.selectedCategory }) && record.calculatedDistance < distanceThreshold;
        })
        $scope.hcoList = _.orderBy(filteredList, 'calculatedDistance');
    }

    function distance(lat1, lat2, lon1, lon2) {

        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

        let c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;

        // calculate the result
        return (c * r);
    }

    $scope.distance = Math.round(distance($scope.coordinates.lat, $scope.coordinates.long, 40.4501, -74.5211), 2);
    $scope.getMyLocation();
    $scope.fetchActivities(1000);
    //$scope.fetchCodesBylabel(100);
});