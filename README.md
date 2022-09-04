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
1.  size       : MANDATORY | <number>    | e.g. 8          => The minimum character length of the password.
2.  lower      : MANDATORY | <boolean>   | e.g. true       => The password must contain at least 1 lowercase character.
3.  upper      : MANDATORY | <boolean>   | e.g. true       => The password must contain at least 1 uppercase character.
4.  numbers    : MANDATORY | <boolean>   | e.g. true       => The password must contain at least 1 numeral character.

```


# EXAMPLE

```
const ppSetter = require ('password-policy-setter');

let condition = {
  size: 8,
  lower: true,
  upper: true,
  numbers: true
};

policy.init(condition);

let okpwd = "AbC4eF78";
let notokpwd = 'AB3DEF8D';

 policy.satisfied (okpwd);    // returns true;
 policy.satisfied (notokpwd); // returns false;

 policy.findAnomaly (okpwd);    // returns { size: true, lower: true, upper: true, numbers: true}
 policy.findAnomaly (notokpwd); // returns { size: true, lower: false, upper: true, numbers: true}
```
