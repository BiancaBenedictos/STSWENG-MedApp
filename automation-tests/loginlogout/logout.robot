*** Settings ***
Documentation	This is a test suite for logout.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
Successful User Logout
	Open Browser to Login Page
	Input Email  	${VALID USER EMAIL}
	Input Password	${VALID USER PASS}
	Click Element	class:heading
	Click Button		submitlogin
	Wait Until Element Is Visible 		id:navUserName 		timeout=10
	Click Element  		id:navUserName
	Click Element  		logoutbtn
	Wait Until Location Is 	http://localhost:3000/	timeout=10
	[Teardown]	Close Browser
	
Invalid User Logout
	Open Browser to Login Page
	Input Email  	${VALID DOC EMAIL}
	Input Password	${VALID DOC PASS}
	Click Button		submitlogin
	Wait Until Location Is 	http://localhost:3000/homeDoctors	timeout=10
	Go To 		https://www.google.com/
	Go To 		http://localhost:3000/homeDoctors
	Page Should Contain Element 		doctors
	[Teardown]	Close Browser