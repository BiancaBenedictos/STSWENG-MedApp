*** Settings ***
Documentation	This is a test suite for the adding and removing of clinics.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***

Successful adding of clinic
	Open Browser to Login Page
	Input Email  	${ADMIN EMAIL}
	Input Password	${ADMIN PASS}
	Click Button		submitlogin
	Wait Until Element Is Visible 		id:navName  		timeout=10
	Click Element 		navName
	Click Element 		view-clinics
	Wait Until Element Is Visible 		id:clinics
	Click Button 		addclinicBtn
	Wait Until Element Is Visible 		id:add-clinic
	Input Text			clinic-name 	automationtest Clinic
	Input Text			street			automationtest Street
	Input Text			city		 	automationtest City
	Input Text			state			automationtest State
	Click Button 		saveClinic
	[Teardown]	Close Browser

Successful removing of clinic
	Open Browser to Login Page
	Input Email  	${ADMIN EMAIL}
	Input Password	${ADMIN PASS}
	Click Button		submitlogin
	Wait Until Element Is Visible 		id:navName  		timeout=10
	Click Element 		navName
	Click Element 		view-clinics
	Wait Until Element Is Visible 		id:clinics
	Click Button 		deleteClinicautomationtest Clinic
	Wait Until Element Is Visible 		deleteClinic
	Click Button 		confirmDelete
	Wait Until Element Is Visible 		okBtn
	Click Button		okBtn
	Wait Until Element Is Not Visible 		deleteClinicautomationtest Clinic
	[Teardown]	Close Browser	
