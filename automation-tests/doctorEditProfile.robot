*** Settings ***
Documentation	This is a test suite for Doctor Update Information.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
	
Successful Doctor Login
	Open Browser to Login Page
	Input Email 	${VALID DOC EMAIL}
	Input Password	${VALID DOC PASS}
	Click Button		submitlogin
	Wait Until Location Is 	http://localhost:3000/homeDoctors	timeout=20

Doctor Update Information
	Click Element		navName
	Click Element		edit-profile
	Wait Until Location Is 	http://localhost:3000/editProfile 	timeout=20
	Input First Name	AutomatedTest	
	Input Last Name		AutomatedDoctor
	Click Button		edit-btn
	Alert Should Be Present		action=OKAY		timeout=none
	[Teardown]	Close Browser