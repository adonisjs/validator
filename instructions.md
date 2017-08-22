## Register provider

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  '@adonisjs/validator/providers/ValidatorProvider'
]
```

That's all 🎉

## Route validator

This provider enables to write bind validators to the route.

```js
Route
  .post('users', 'UserController.store')
  .validator('User')
```


Next create the validator file inside `app/Validators` directory, or use the ace command.

```bash
adonis make:validator User
```


#### app/Validators/User.js
```js
class UserValidator {
 
  get rules () {
    // validation rules
  }

  get sanitizationRules () {
    // sanitize data before validation
  }

}

module.exports = UserValidator
```
