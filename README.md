### HCO Finder HTML5 Mobile APP

A HCO Finder HTML5 Mobile APP

#### Prerequisites

Create an apiKey at https://www.healthcarelocator.com/en/pricing for a particular region. For example united states
#### Clone it

```
git clone https://github.com/piyush-repo/piyush-repo.github.io.git
```

#### SetUp
```
Include the necessary HCO SDKs 
<script src="https://static.healthcarelocator.com/v1/hcl-sdk-web-ui/hcl-sdk.js"></script>
<script src="https://static.healthcarelocator.com/v1/hcl-sdk-api/hcl-sdk-api.js"></script>

In Controller.js file at line : 100 replace the api key.

$scope.hclAPI = new HclAPI({ apiKey: "30015d4934c30a75"});
```

#### HCO SDK Usage
````
Basically we have consumed the HCO Graphql Service like  
hclAPI.activities and hclAPI.codesByLabel graphql methods. Main aim was to leverage the graphql service and build customized solutions on top of that.
````
#### How to use the app
Open the index.html in your browser and view it in mobile mode for a better visibility But currently this HTML5 mobile app can be accessed at https://piyush-repo.github.io/

#### App Details

Currently this HTML5 mobile app is an HCO finder where the user need to select a category and click on seachNearby button and it shows the list of cards of HCO's based on the category selected. Each card contains Physician Name , Address and Location (It shows the distance of the HCO from your current location) with Inquiry button.

Upon clicking on location on a particular card it opens up an google map with an marker pointed on the actual location of the HCO.

Upon clicking on Inquiry on a particular card, it opens up a pop up and user can enter his details, health problems and share his contact details and then click on submit button.



