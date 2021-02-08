*** Settings ***
Documentation	This is a test suite for the successful doctor register 
...				suite.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
Successful Doctor Register with Profile Pic
	Open Browser to Doctor Register Page
	Input First Name	Test	
	Input Last Name		Doctor
	Input Email		autotest1@dr.com
	Input Password	auto
	Input Confirm Password	auto

	Choose file 	picture		${DOC PROFILE PIC}
	Select From List By Value		name:profession		Surgeon
	Choose File		credentials		${DOC CREDENTIALS}

	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	[Teardown]	Close Browser
	
Successful Doctor Register without Profile Pic
	Open Browser to Doctor Register Page
	Input First Name	Test	
	Input Last Name		Doctor2
	Input Email		autotest2@dr.com
	Input Password	auto
	Input Confirm Password	auto

	Select From List By Value		name:profession		Surgeon
	Choose File		credentials		${DOC CREDENTIALS}
	Select From List By Index		name:clinics[]		1

	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	[Teardown]	Close Browser

Successful Doctor Register with 2 clinics
	Open Browser to Doctor Register Page
	Input First Name	Test	
	Input Last Name		Doctor2
	Input Email		autotest3@dr.com
	Input Password	auto
	Input Confirm Password	auto

	Select From List By Value		name:profession		Oncologist
	Choose File		credentials		${DOC CREDENTIALS}
	Select From List By Index		name:clinics[]		1
	Click Button		addClinic
	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	[Teardown]	Close Browser