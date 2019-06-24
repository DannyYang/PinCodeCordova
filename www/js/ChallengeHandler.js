/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var PinCodeChallengeHandler = function(){
  PinCodeChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("PinCodeAttempts");

  PinCodeChallengeHandler.handleChallenge = function(challenge) {
      console.log('handleChallenge~~');
      console.log("handleChallenge : " + JSON.stringify(challenge));
      var msg = "";

      // Create the title string for the prompt
      if(challenge.errorMsg !== null){
          msg =  challenge.errorMsg + "\n";
      }
      else{
          msg = "This data requires a PIN code.\n";
      }
      msg += "Remaining attempts: " + challenge.remainingAttempts;

      // Display a prompt for user to enter the pin code
      var pinCode = prompt(msg, "");
      if(pinCode){ // calling submitChallengeAnswer with the entered value
          PinCodeChallengeHandler.submitChallengeAnswer({"pin":pinCode});
      }
      else{ // calling cancel in case user pressed the cancel button
          PinCodeChallengeHandler.cancel();
      }


  };

  // handleSuccess
  PinCodeChallengeHandler.handleSuccess = function(response) {
    console.log('handleSuccess~~');
    console.log(response);
  };

  // handleFailure
  PinCodeChallengeHandler.handleFailure = function(error) {
      WL.Logger.debug("Challenge Handler Failure!");
      if(error.failure !== null && error.failure !== undefined){
         alert(error.failure);
      }
      else {
         alert("Unknown error");
      }
  };
};
// PinCodeChallengeHandler();

var connectMobileFirstServer = function() {
    console.log("connectMobileFirstServer");

    function logoutMobileFirstServer() {
        WLAuthorizationManager.logout('PinCodeAttempts').then(
            function (response) {
                console.log('WL logout success');
                console.log(response);
                WL.App.sendActionToNative("MFReady");
            },
            function (response) {
                console.log('WL logout fail');
                console.log(response);
                WL.App.sendActionToNative("MFReady");
            }
        );
    }

    function obtainMobileFirstServerAccessToken() {
		// 連接至MobileFirst Server API，僅在Mobile Client上才能連結
		WLAuthorizationManager.obtainAccessToken()
			.then(
				function (response) {
					connectSuccess(response);
				},
				function (response) {
					connectFail(response);
				}
			);
    }

    function connectSuccess(response) {
		console.log("Obtained token successfully.");
		PinCodeChallengeHandler();
        logoutMobileFirstServer();
    }

    function connectFail(response) {
        console.log("*** Failed obtaining token.");
        setTimeout(function () {
            obtainMobileFirstServerAccessToken();
        }, 3000);
    }

    obtainMobileFirstServerAccessToken();
};