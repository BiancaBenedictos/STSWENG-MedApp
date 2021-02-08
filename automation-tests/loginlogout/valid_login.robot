*** Settings ***
Documentation	This is a test suite for the valid login.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
Successful Patient Login
	Open Browser to Login Page
	Input Email  	${VALID USER EMAIL}
	Input Password	${VALID USER PASS}
	Click Button		submitlogin
	Wait Until Location Is 	http://localhost:3000/homeDoctors	timeout=10
	[Teardown]	Close Browser
	
Successful Doctor Login
	Open Browser to Login Page
	Input Email 	${VALID DOC EMAIL}
	Input Password	${VALID DOC PASS}
	Click Button		submitlogin
	Wait Until Location Is 	http://localhost:3000/homeDoctors	timeout=10
	[Teardown]	Close Browser