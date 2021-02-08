*** Settings ***
Documentation	This is the main resource file for the variables 
...				and all other custom keywords.
Library			SeleniumLibrary

*** Variables ***
${SERVER}			http://localhost:3000/
${BROWSER}			Chrome
${VALID USER EMAIL}	valid@patient.com
${VALID USER PASS}	valid
${VALID DOC EMAIL}	valid@doctor.com
${VALID DOC PASS}	valid
${ADMIN EMAIL} 		admin@admin.com
${ADMIN PASS} 		a

${DOC PROFILE PIC}		${CURDIR}/docprof.jpg
${DOC CREDENTIALS}		${CURDIR}/PDF.pdf
${USER PROFILE PIC}		${CURDIR}/patprof.jpg

${LOGIN URL}		${SERVER}
${DOC REGISTER URL}		${SERVER}doctorRegister
${PATIENT REGISTER URL}		${SERVER}patientRegister

*** Keywords ***
Open Browser to Login Page
	Open Browser	${LOGIN URL}		${BROWSER}
	Maximize Browser Window
	Page Should Contain Element		id:submitlogin

Open Browser to Doctor Register Page
	Open Browser	${DOC REGISTER URL}		${BROWSER}
	Maximize Browser Window
	Page Should Contain Element		id:addClinic

Open Browser to Patient Register Page
	Open Browser	${PATIENT REGISTER URL}		${BROWSER}
	Maximize Browser Window
	Page Should Contain Element		id:weight

Input First Name
	[Arguments]		${fname}
	Input Text	firstname 	${fname}

Input Last Name
	[Arguments]		${lname}
	Input Text	lastname 	${lname}

Input Email
	[Arguments]		${email}
	Input Text	email 	${email}

Input Password
	[Arguments]		${password}
	Input Text	password 	${password}

Input Confirm Password
	[Arguments]		${conpassword}
	Input Text	cpassword 	${conpassword}

Input Age
	[Arguments]		${age}
	Input Text	age 	${age}

Input Weight
	[Arguments]		${weight}
	Input Text	weight 	${weight}

Input Height
	[Arguments]		${height}
	Input Text	height 	${height}

Login error message
	[Arguments]		${error}
	Element Text Should Be 	id:msg	${error}