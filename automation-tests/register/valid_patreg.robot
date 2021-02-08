*** Settings ***
Documentation	This is a test suite for the successful patient register 
...				suite.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
Successful Patient Register with Profile Pic
	Open Browser to Patient Register Page
	Input First Name	AutoTest	
	Input Last Name		Patient
	Input Email		autotest@patient.com
	Input Password	auto
	Input Confirm Password	auto
	Choose file 	picture		${USER PROFILE PIC}
	Input Age		37
	Input Weight	65
	Input Height	164
	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	[Teardown]	Close Browser
	
Successful Patient Register without Profile Pic
	Open Browser to Patient Register Page
	Input First Name	AutoTest	
	Input Last Name		Patient2
	Input Email		autotest2@patient.com
	Input Password	auto
	Input Confirm Password	auto
	Input Age		19
	Input Weight	52
	Input Height	154
	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	[Teardown]	Close Browser

Successful Patient Register with Decimals
	Open Browser to Patient Register Page
	Input First Name	AutoTest	
	Input Last Name		Patient3
	Input Email		autotest3@patient.com
	Input Password	auto
	Input Confirm Password	auto
	Input Age		19
	Input Weight	52.3
	Input Height	160.5
	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	[Teardown]	Close Browser