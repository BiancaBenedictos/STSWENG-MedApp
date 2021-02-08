*** Settings ***
Documentation	This is a test suite for the INVALID patient register 
...				suite.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
Patient Register using existing patient email
	Open Browser to Patient Register Page
	Input First Name	Test	
	Input Last Name		Patient
	Input Email		${VALID USER EMAIL}
	Input Password	auto
	Input Confirm Password	auto
	Input Age		37
	Input Weight	65
	Input Height	164
	Click Button	submitbtn
	Element Text Should Be 		id:emailErrorMsg		Email address is already in use
	Location Should Be 		${PATIENT REGISTER URL}
	[Teardown]	Close Browser

Patient Register using existing doctor email
	Open Browser to Patient Register Page
	Input First Name	Test	
	Input Last Name		Patient
	Input Email		${VALID DOC EMAIL}
	Input Password	auto
	Input Confirm Password	auto
	Input Age		37
	Input Weight	65
	Input Height	164
	Click Button	submitbtn
	Element Text Should Be 		id:emailErrorMsg		Email address is already in use
	Location Should Be 		${PATIENT REGISTER URL}
	[Teardown]	Close Browser

Patient Register with negative values
	Open Browser to Patient Register Page
	Input First Name	Test	
	Input Last Name		Patient
	Input Email		failautopat@gmail.com
	Input Password	auto
	Input Confirm Password	auto
	Input Age		-37
	Input Weight	-65
	Input Height	-164
	Click Button	submitbtn
	Element Text Should Be 		id:ageErrorMsg		Please enter a non-negative number
	Element Text Should Be 		id:weightErrorMsg		Please enter a non-negative number
	Element Text Should Be 		id:heightErrorMsg		Please enter a non-negative number
	Location Should Be 		${PATIENT REGISTER URL}
	[Teardown]	Close Browser

Patient Register with empty fields
	Open Browser to Patient Register Page
	Input First Name	Test	
	Input Last Name		Patient
	Input Age		12
	Input Weight	34.5
	Input Height	90
	Click Button	submitbtn
	Element Text Should Be 		id:emailErrorMsg		Please enter a valid email address
	Element Text Should Be 		id:passErrorMsg		Please enter a password
	Element Text Should Be 		id:cpassErrorMsg		Please enter a password
	Location Should Be 		${PATIENT REGISTER URL}
	[Teardown]	Close Browser

Patient Register with unmatching passwords
	Open Browser to Patient Register Page
	Input First Name	Test	
	Input Last Name		Patient
	Input Email		failautopat@gmail.com
	Input Password	auto
	Input Confirm Password	test
	Input Age		12
	Input Weight	34.5
	Input Height	90
	Click Button	submitbtn
	Element Text Should Be 		id:cpassErrorMsg		Passwords do not match
	Location Should Be 		${PATIENT REGISTER URL}
	[Teardown]	Close Browser