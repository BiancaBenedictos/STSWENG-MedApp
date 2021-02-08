*** Settings ***
Documentation	This is a test suite for the invalid doctor register 
...				suite.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
Doctor Register without credentials
	Open Browser to Doctor Register Page
	Input First Name	Test	
	Input Last Name		Doctor
	Input Email		failautotest@dr.com
	Input Password	auto
	Input Confirm Password	auto
	Choose file 	picture		${DOC PROFILE PIC}
	Select From List By Value		name:profession		Surgeon
	Select From List By Index		name:clinics[]		1
	Click Button	submitbtn
	Wait Until Element Is Visible 		id:credentialserror
	Element Text Should Be 		id:credentialserror		Please upload Credentials
	Location Should Be 		${DOC REGISTER URL}
	[Teardown]	Close Browser
	
Doctor Register using existing patient email
	Open Browser to Doctor Register Page
	Input First Name	Test	
	Input Last Name		Doctor
	Input Email		${VALID USER EMAIL}	
	Input Password	auto
	Input Confirm Password	auto
	Choose file 	picture		${DOC PROFILE PIC}
	Select From List By Value		name:profession		Dermatologist
	Choose File		credentials		${DOC CREDENTIALS}
	Select From List By Index		name:clinics[]		2
	Click Button	submitbtn
	Wait Until Element Is Visible 		id:emailErrorMsg
	Element Text Should Be 		id:emailErrorMsg		Email address is already in use
	Location Should Be 		${DOC REGISTER URL}
	[Teardown]	Close Browser

Doctor Register using existing doctor email
	Open Browser to Doctor Register Page
	Input First Name	Test	
	Input Last Name		Doctor
	Input Email		${VALID DOC EMAIL}
	Input Password	auto
	Input Confirm Password	auto
	Choose file 	picture		${DOC PROFILE PIC}
	Select From List By Value		name:profession		Dermatologist
	Choose File		credentials		${DOC CREDENTIALS}
	Select From List By Index		name:clinics[]		1
	Click Button	submitbtn
	Wait Until Element Is Visible 		id:emailErrorMsg
	Element Text Should Be 		id:emailErrorMsg		Email address is already in use
	Location Should Be 		${DOC REGISTER URL}
	[Teardown]	Close Browser

Doctor Register with unmatching passwords
	Open Browser to Doctor Register Page
	Input First Name	Test	
	Input Last Name		Doctor
	Input Email		failautotest@dr.com
	Input Password	auto
	Input Confirm Password	test
	Choose file 	picture		${DOC PROFILE PIC}
	Select From List By Value		name:profession		Dermatologist
	Choose File		credentials		${DOC CREDENTIALS}
	Select From List By Index		name:clinics[]		1
	Click Button	submitbtn
	Wait Until Element Is Visible 		id:cpassErrorMsg
	Element Text Should Be 		id:cpassErrorMsg		Passwords do not match
	Location Should Be 		${DOC REGISTER URL}
	[Teardown]	Close Browser

Doctor Register with empty fields
	Open Browser to Doctor Register Page
	Input Email		failautotest@dr.com
	Input Password	test
	Input Confirm Password	test
	Select From List By Value		name:profession		Dermatologist
	Choose File		credentials		${DOC CREDENTIALS}
	Click Button	submitbtn
	Wait Until Element Is Visible 		id:fnameErrorMsg
	Element Text Should Be 		id:fnameErrorMsg		First name is required.
	Element Text Should Be 		id:lnameErrorMsg		Last name is required.
	Location Should Be 		${DOC REGISTER URL}
	[Teardown]	Close Browser