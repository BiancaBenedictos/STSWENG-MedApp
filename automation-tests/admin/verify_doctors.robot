*** Settings ***
Documentation	This is a test suite for the verifying of doctors.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***


Valid Confirm Verify Doctor
	Open Browser to Doctor Register Page
	Input First Name	automationAccept
	Input Last Name		testdoctor
	Input Email		autoverifydoctor@confirm.com
	Input Password	auto
	Input Confirm Password	auto

	Select From List By Value		name:profession		Surgeon
	Choose File		credentials		${DOC CREDENTIALS}

	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	Click Element  		id:navName
	Click Element  		logoutbtn
	Wait Until Location Is 	http://localhost:3000/	timeout=10

	Input Email  	${ADMIN EMAIL}
	Input Password	${ADMIN PASS}
	Click Button		submitlogin
	Wait Until Element Is Visible 		id:navName  		timeout=10
	Click Element 		navName
	Click Element 		verify-doctors
	Wait Until Element Is Visible 		id:pending 

	Click Button 		acceptBtnautomationAccepttestdoctor
	Wait Until Element Is Visible 		questionAccept
	Click Button 		confirmAccept
	Wait Until Element Is Not Visible		acceptBtnautomationAccepttestdoctor
	Go To 		http://localhost:3000/adminDoctors
	Wait Until Element Is Visible  		automationAccepttestdoctor
	[Teardown]	Close Browser

Valid Reject Verify Doctor
	Open Browser to Doctor Register Page
	Input First Name	automationReject	
	Input Last Name		testdoctor
	Input Email		autoverifydoctor@reject.com
	Input Password	auto
	Input Confirm Password	auto

	Select From List By Value		name:profession		Surgeon
	Choose File		credentials		${DOC CREDENTIALS}

	Click Button	submitbtn
	Wait Until Location Is 	http://localhost:3000/upcomingAppointments	timeout=10
	Click Element  		id:navName
	Click Element  		logoutbtn
	Wait Until Location Is 	http://localhost:3000/	timeout=10

	Input Email  	${ADMIN EMAIL}
	Input Password	${ADMIN PASS}
	Click Button		submitlogin
	Wait Until Element Is Visible 		id:navName  		timeout=10
	Click Element 		navName
	Click Element 		verify-doctors
	Wait Until Element Is Visible 		id:pending 

	Click Button 		rejectBtnautomationRejecttestdoctor
	Wait Until Element Is Visible 		questionReject
	Click Button 		confirmReject
	Wait Until Element Is Not Visible		rejectBtnautomationRejecttestdoctor
	Go To 		http://localhost:3000/adminDoctors
	Element Should Not Be Visible  		automationRejecttestdoctor
	[Teardown]	Close Browser
