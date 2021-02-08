*** Settings ***
Documentation	This is a test suite for the INVALID login.
...
...				This example uses only keywords from the SeleniumLibrary.
Resource 		resource.robot


*** Test Cases ***
Email does not exist
	Open Browser to Login Page
	Input Email	test@g.com
	Input Password	test
	Click Button	submitlogin
	Login error message 	The username or password is not valid
	Location Should Be 		${LOGIN URL}
	[Teardown]	Close Browser

Incorrect Password
	Open Browser to Login Page
	Input Email	test@dr.com
	Input Password	123
	Click Button	submitlogin
	Login error message  	The username or password is not valid
	Location Should Be 		${LOGIN URL}
	[Teardown]	Close Browser

Login with empty field
	Open Browser to Login Page
	Input Email	test@dr.com
	Click Button	submitlogin
	Login error message  	The username or password is not valid
	Location Should Be 		${LOGIN URL}
	[Teardown]	Close Browser

Login with no input
	Open Browser to Login Page
	Click Button	submitlogin
	Location Should Be 		${LOGIN URL}
	[Teardown]	Close Browser

	