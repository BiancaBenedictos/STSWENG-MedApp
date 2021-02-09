*** Settings ***
Documentation	This is a test suite for Patient Update Information.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
	
Successful Patient Login
	Open Browser to Login Page
	Input Email  	${VALID USER EMAIL}
	Input Password	${VALID USER PASS}
	Click Button		submitlogin
	Wait Until Location Is 	http://localhost:3000/homeDoctors	timeout=20

Doctor Update Information
	Click Element		navName
	Click Element		edit-profile
	Wait Until Location Is 	http://localhost:3000/editProfile 	timeout=20
	Input First Name	AutomatedTestUser	
	Input Last Name		Automated
	Click Button		edit-btn
	Alert Should Be Present		action=OKAY		timeout=none
	[Teardown]	Close Browser