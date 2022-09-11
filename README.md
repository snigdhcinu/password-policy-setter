# password-policy-setter
A simple interface module that creates password-policy for your application.

# INTRODUCTION

This module is a simple alternate to creating complex native Regex, or tedious multidimensional checks on password-string to check required elements.

# USAGE

1. Require the module.
2. Use the init method to pass arguments determining the policy.
3. Then use the satisfied method to check whether or not the password-policy is satisfied.
4. Alternatively, can use the findAnomaly method, to know which conditions are fulfilled and which aren't via an object returned.


# PARAMETERS
```
1.  size       : MANDATORY | <number>                | e.g. 8          => The minimum character length of the password.
2.  lower      : OPTIONAL  | <number> or <boolean>   | default : false | e.g. true/3       => The password must contain at least n lowercase character, where n is the value passed.
3.  upper      : OPTIONAL  | <number> or <boolean>   | default : false | e.g. true/1       => The password must contain at least n uppercase character, where n is the value passed.
4.  numbers    : OPTIONAL  | <number> or <boolean>   | default : false | e.g. true/1       => The password must contain at least n numeral character, where n is the value passed.
5.  splChar    : OPTIONAL  | <number> or <boolean>   | default : false | e.g. false/0      => The password must contain at least n special character (character other than A-Z, a-z, 0-9), where n is the value passed.

```
Note: 
1. negative numbers will be treated as 0.
2. any positive number will be treated as true, and the no. of times that character should be present in the string.

# EXAMPLE

```
const ppSetter = require ('password-policy-setter');

let condition = {
  size    : 8,
  lower   : true, // or 2
  upper   : true, // or 1
  numbers : true, // or 1
	splChar : true, // or 1
};


let notokcondition = {
  size     : 8,
	lower    : true,
	upper    : true,
	numbers  : true,
	splChars : true,
};

ppSetter.init(condition);

let okpwd = "Ab@4_eF7.k";
let notokpwd = 'AB3DeF8D';

 ppSetter.satisfied (okpwd);    // returns true;
 ppSetter.satisfied (notokpwd); // returns false;

 ppSetter.findAnomaly (okpwd);    // returns { size: true, lower: true, upper: true, numbers: true}
 ppSetter.findAnomaly (notokpwd); // returns { size: true, lower: false, upper: true, numbers: true}
 
 ppSetter.init (notokcondition); // errorState, thus any subsequent call to any of the policy methods will early return with error object.
 ppSetter.satisfied (okpwd);     // returns {message : 'Unknown or Unidentified condition passed, exiting', key : 'splChars'}
 ppSetter.satisfied (notokpwd);  // returns {message : 'Unknown or Unidentified condition passed, exiting', key : 'splChars'}

```
# PATCH NOTES 

## 2.3.1
1. Only size param mandatory, rest optional, with default value of false.
2. Can pass either a boolean or number as param value.
3. Ability to specify the number of times a certain character-type should be present.

## 2.3.2
1. Bug fix.
2. Upper limit added too (1000).
3. In findAnomaly, only the keys with a non-false or non-zero value will be shown, previously all keys were shown with a default value false.

## 2.3.5
1. Fixed all bugs.
2. Stable version.
